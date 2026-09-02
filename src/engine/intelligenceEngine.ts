// ═══════════════════════════════════════════════════════════
// SURTAMIND — Intelligence Engine
// Deterministic, explainable rule engine — no LLM dependency
// ═══════════════════════════════════════════════════════════

import type {
  Trial, EthicsReview, Participant, Visit, CRF,
  AdverseEvent, ComplianceItem, Alert, TrialHealthScore,
  PrakritiDistribution, DoshaTrajectoryPoint
} from '../types/domain';

// ─────────────────────────────────────────
// ALERT GENERATION RULES
// ─────────────────────────────────────────

export function generateAlerts(
  trial: Trial,
  ethics: EthicsReview,
  participants: Participant[],
  visits: Visit[],
  crfs: CRF[],
  adverseEvents: AdverseEvent[],
): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  // RULE 1: Unreviewed SAEs
  const pendingSAEs = adverseEvents.filter(
    ae => ae.isSerious && ae.status === 'Under Review'
  );
  if (pendingSAEs.length > 0) {
    alerts.push({
      id: 'alert-sae',
      trialId: trial.id,
      type: 'SAE_REVIEW',
      priority: 'Critical',
      title: `${pendingSAEs.length} SAE ${pendingSAEs.length === 1 ? 'review' : 'reviews'} pending`,
      description: `${pendingSAEs.length} serious adverse event(s) require PI sign-off within 7 days per protocol.`,
      count: pendingSAEs.length,
      entityType: 'AdverseEvent',
      entityIds: pendingSAEs.map(ae => ae.id),
      navigateTo: `/trials/${trial.id}/safety`,
      createdAt: now.toISOString(),
      isResolved: false,
    });
  }

  // RULE 2: Ethics renewal within 30 days
  if (ethics.expiryDate && trial.status === 'ACTIVE') {
    const expiryDate = new Date(ethics.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 30 && daysUntilExpiry > 0) {
      alerts.push({
        id: 'alert-ethics',
        trialId: trial.id,
        type: 'ETHICS_RENEWAL',
        priority: daysUntilExpiry < 14 ? 'Critical' : 'High',
        title: `Ethics approval expires in ${daysUntilExpiry} days`,
        description: `${ethics.approvalNumber} expires ${ethics.expiryDate}. Trial has ${trial.currentEnrollment} active participants.`,
        count: 1,
        entityType: 'EthicsReview',
        entityIds: [ethics.id],
        navigateTo: `/trials/${trial.id}/ethics`,
        createdAt: now.toISOString(),
        isResolved: false,
      });
    }
  }

  // RULE 3: Overdue visits
  const overdueVisits = visits.filter(v => v.status === 'Overdue');
  const overdueParticipantIds = [...new Set(overdueVisits.map(v => v.participantId))];
  if (overdueParticipantIds.length > 0) {
    alerts.push({
      id: 'alert-visits',
      trialId: trial.id,
      type: 'OVERDUE_VISIT',
      priority: overdueParticipantIds.length > 5 ? 'High' : 'Medium',
      title: `${overdueParticipantIds.length} participant${overdueParticipantIds.length > 1 ? 's' : ''} have overdue visits`,
      description: `${overdueParticipantIds.join(', ')} have missed scheduled visits by more than 7 days.`,
      count: overdueParticipantIds.length,
      entityType: 'Visit',
      entityIds: overdueParticipantIds,
      navigateTo: `/trials/${trial.id}/visits`,
      createdAt: now.toISOString(),
      isResolved: false,
    });
  }

  // RULE 4: Missing CRF fields
  const incompleteCRFs = crfs.filter(crf => crf.missingRequiredFields.length > 0);
  if (incompleteCRFs.length > 0) {
    const uniqueParticipants = [...new Set(incompleteCRFs.map(c => c.participantId))];
    alerts.push({
      id: 'alert-crf',
      trialId: trial.id,
      type: 'MISSING_CRF',
      priority: 'Medium',
      title: `${uniqueParticipants.length} CRFs have missing required fields`,
      description: `Data lock approaching. CRFs for ${uniqueParticipants.slice(0,5).join(', ')}${uniqueParticipants.length > 5 ? '...' : ''} have incomplete required data.`,
      count: uniqueParticipants.length,
      entityType: 'CRF',
      entityIds: uniqueParticipants,
      navigateTo: `/trials/${trial.id}/participants`,
      createdAt: now.toISOString(),
      isResolved: false,
    });
  }

  // RULE 5: Open AEs that are not SAEs but unreviewed > 14 days
  const staleOpenAEs = adverseEvents.filter(
    ae => ae.status === 'Open' && !ae.isSerious
  );
  if (staleOpenAEs.length > 0) {
    alerts.push({
      id: 'alert-ae-open',
      trialId: trial.id,
      type: 'SAFETY_REVIEW',
      priority: 'Low',
      title: `${staleOpenAEs.length} open adverse event${staleOpenAEs.length > 1 ? 's' : ''} require review`,
      description: 'Non-serious adverse events pending review and closure.',
      count: staleOpenAEs.length,
      entityType: 'AdverseEvent',
      entityIds: staleOpenAEs.map(ae => ae.id),
      navigateTo: `/trials/${trial.id}/safety`,
      createdAt: now.toISOString(),
      isResolved: false,
    });
  }

  return alerts;
}

// ─────────────────────────────────────────
// TRIAL HEALTH SCORE
// Deterministic, weighted, explainable formula
// ─────────────────────────────────────────

export function calculateTrialHealth(
  trial: Trial,
  participants: Participant[],
  visits: Visit[],
  crfs: CRF[],
  adverseEvents: AdverseEvent[],
  complianceItems: ComplianceItem[],
): TrialHealthScore {
  // 1. Enrollment (20%) — current vs target
  const enrollmentRate = trial.currentEnrollment / trial.targetEnrollment;
  const enrollmentScore = Math.min(enrollmentRate * 100, 100);

  // 2. Follow-up (20%) — completed visits / expected visits
  const completedVisits = visits.filter(v => v.status === 'Completed').length;
  const expectedVisits = visits.filter(v => v.status !== 'Upcoming').length;
  const followUpScore = expectedVisits > 0 ? (completedVisits / expectedVisits) * 100 : 100;

  // 3. Data Quality (20%) — CRF completeness
  const avgCompletion = crfs.length > 0
    ? crfs.reduce((sum, c) => sum + c.completionPercentage, 0) / crfs.length
    : 100;
  const dataQualityScore = avgCompletion;

  // 4. Safety (20%) — penalize for unreviewed SAEs
  const unreviewedSAEs = adverseEvents.filter(ae => ae.isSerious && ae.status === 'Under Review').length;
  const safetyScore = Math.max(0, 100 - (unreviewedSAEs * 12));

  // 5. Compliance (20%) — compliance items
  const nonCompliant = complianceItems.filter(ci => ci.status === 'Non-Compliant').length;
  const warning = complianceItems.filter(ci => ci.status === 'Warning').length;
  const complianceScore = Math.max(0, 100 - (nonCompliant * 15) - (warning * 5));

  // Weighted average (equal weights)
  const overall = Math.round(
    (enrollmentScore * 0.2) +
    (followUpScore * 0.2) +
    (dataQualityScore * 0.2) +
    (safetyScore * 0.2) +
    (complianceScore * 0.2)
  );

  const label: TrialHealthScore['label'] =
    overall >= 80 ? 'Healthy' :
    overall >= 65 ? 'Needs Attention' :
    overall >= 50 ? 'At Risk' : 'Critical';

  return {
    overall,
    label,
    enrollment: Math.round(enrollmentScore),
    followUp: Math.round(followUpScore),
    dataQuality: Math.round(dataQualityScore),
    safety: Math.round(safetyScore),
    compliance: Math.round(complianceScore),
  };
}

// ─────────────────────────────────────────
// AYURVEDA RESEARCH INSIGHTS
// Exploratory analysis — never clinical efficacy claims
// ─────────────────────────────────────────

export function getPrakritiDistribution(participants: Participant[]): PrakritiDistribution {
  const dist: PrakritiDistribution = { vata: 0, pitta: 0, kapha: 0, vataPitta: 0, pittaKapha: 0, vataKapha: 0, sama: 0 };
  participants.forEach(p => {
    switch(p.prakriti) {
      case 'Vata': dist.vata++; break;
      case 'Pitta': dist.pitta++; break;
      case 'Kapha': dist.kapha++; break;
      case 'Vata-Pitta': dist.vataPitta++; break;
      case 'Pitta-Kapha': dist.pittaKapha++; break;
      case 'Vata-Kapha': dist.vataKapha++; break;
      case 'Sama': dist.sama++; break;
    }
  });
  return dist;
}

export function getOutcomeByPrakriti(participants: Participant[], crfs: CRF[]): Array<{prakriti: string, avgOutcome: number, count: number}> {
  // Group participants by dominant prakriti, get average primary outcome change
  const groups: Record<string, number[]> = { Vata: [], Pitta: [], Kapha: [] };

  participants.forEach(p => {
    if (!p.dominantDosha) return;
    const participantCRFs = crfs.filter(c => c.participantId === p.id && c.outcomes.primaryOutcomeValue !== null);
    if (participantCRFs.length < 2) return;
    const baseline = participantCRFs[0].outcomes.primaryOutcomeValue!;
    const latest = participantCRFs[participantCRFs.length - 1].outcomes.primaryOutcomeValue!;
    const change = latest - baseline;
    groups[p.dominantDosha]?.push(change);
  });

  return Object.entries(groups).map(([prakriti, values]) => ({
    prakriti,
    avgOutcome: values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0,
    count: values.length,
  }));
}

export function getAverageDoshaTrajectory(doshaAssessments: import('../types/domain').DoshaAssessment[]): DoshaTrajectoryPoint[] {
  const byVisit: Record<string, { vata: number[], pitta: number[], kapha: number[] }> = {};

  doshaAssessments.forEach(da => {
    const visit = da.visitId.split('-').pop() || 'v1';
    const key = visit === '1' ? 'V1' : visit === '2' ? 'V2' : visit === '3' ? 'V3' : visit;
    if (!byVisit[key]) byVisit[key] = { vata: [], pitta: [], kapha: [] };
    byVisit[key].vata.push(da.vataScore);
    byVisit[key].pitta.push(da.pittaScore);
    byVisit[key].kapha.push(da.kaphaScore);
  });

  return ['V1','V2','V3'].map(visit => {
    const data = byVisit[visit] || { vata: [5], pitta: [3], kapha: [2] };
    const avg = (arr: number[]) => arr.length > 0 ? Math.round((arr.reduce((a,b) => a+b,0) / arr.length) * 10) / 10 : 0;
    return { visit, vata: avg(data.vata), pitta: avg(data.pitta), kapha: avg(data.kapha) };
  });
}

// Safety prioritization — non-LLM clinical priority scoring
export function getSafetyPriority(ae: AdverseEvent): AdverseEvent['priority'] {
  if (ae.isSerious && (ae.severity === 'Life-threatening' || ae.severity === 'Fatal')) return 'Critical';
  if (ae.isSerious && ae.status === 'Under Review') return 'Critical';
  if (ae.isSerious) return 'High';
  if (ae.severity === 'Severe' || ae.causality === 'Definite' || ae.causality === 'Probable') return 'Review';
  return 'Routine';
}
