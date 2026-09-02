// ═══════════════════════════════════════════════════════════
// SURTAMIND — Service Layer
// All data access goes through services — swap mock → REST API
// ═══════════════════════════════════════════════════════════

import {
  TRIAL_AYU001, ETHICS_REVIEW, PARTICIPANTS, ALL_VISITS, ALL_CRFS,
  PRAKRITI_ASSESSMENTS, ALL_DOSHA_ASSESSMENTS, FORMULATIONS,
  ADVERSE_EVENTS, COMPLIANCE_ITEMS, AUDIT_LOGS, DEMO_USERS,
} from '../data/seed';
import type {
  Trial, EthicsReview, Participant, Visit, CRF,
  PrakritiAssessment, DoshaAssessment, Formulation,
  AdverseEvent, ComplianceItem, AuditLog, Alert,
  TrialHealthScore, PrakritiDistribution, DoshaTrajectoryPoint, User
} from '../types/domain';
import {
  generateAlerts, calculateTrialHealth,
  getPrakritiDistribution, getOutcomeByPrakriti,
  getAverageDoshaTrajectory
} from '../engine/intelligenceEngine';

// In-memory store (replace with IndexedDB / REST API)
let trials: Trial[] = [TRIAL_AYU001];
let ethics: EthicsReview[] = [ETHICS_REVIEW];
let participants: Participant[] = [...PARTICIPANTS];
let visits: Visit[] = [...ALL_VISITS];
let crfs: CRF[] = [...ALL_CRFS];
let prakritiAssessments: PrakritiAssessment[] = [...PRAKRITI_ASSESSMENTS];
let doshaAssessments: DoshaAssessment[] = [...ALL_DOSHA_ASSESSMENTS];
let formulations: Formulation[] = [...FORMULATIONS];
let adverseEvents: AdverseEvent[] = [...ADVERSE_EVENTS];
let complianceItems: ComplianceItem[] = [...COMPLIANCE_ITEMS];
let auditLogs: AuditLog[] = [...AUDIT_LOGS];

// Simulate async API delay
const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

// ─────────────────────────────────────────
// TRIAL SERVICE
// ─────────────────────────────────────────
export const trialService = {
  async getAll(): Promise<Trial[]> {
    await delay();
    return [...trials];
  },

  async getById(id: string): Promise<Trial | null> {
    await delay();
    return trials.find(t => t.id === id) ?? null;
  },

  async create(data: Omit<Trial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trial> {
    await delay();
    const trial: Trial = {
      ...data,
      id: `trial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    trials = [...trials, trial];
    auditService.log('PI', 'Created Trial', 'Trial', trial.id, `Trial ${trial.trialId} created in DRAFT status`, trial.id);
    return trial;
  },

  async update(id: string, data: Partial<Trial>): Promise<Trial | null> {
    await delay();
    trials = trials.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t);
    const updated = trials.find(t => t.id === id) ?? null;
    if (updated) {
      auditService.log('PI', 'Updated Trial', 'Trial', id, JSON.stringify(data), id);
    }
    return updated;
  },

  async updateStatus(id: string, status: Trial['status']): Promise<Trial | null> {
    return trialService.update(id, { status });
  },
};

// ─────────────────────────────────────────
// PARTICIPANT SERVICE
// ─────────────────────────────────────────
export const participantService = {
  async getByTrial(trialId: string): Promise<Participant[]> {
    await delay();
    return participants.filter(p => p.trialId === trialId);
  },

  async getById(id: string): Promise<Participant | null> {
    await delay();
    return participants.find(p => p.id === id) ?? null;
  },

  async add(data: Omit<Participant, 'id'>): Promise<Participant> {
    await delay();
    const next = participants.filter(p => p.trialId === data.trialId).length + 1;
    const participant: Participant = {
      ...data,
      id: `P-${String(next).padStart(3,'0')}`,
    };
    participants = [...participants, participant];
    // Update trial enrollment count
    trials = trials.map(t =>
      t.id === data.trialId
        ? { ...t, currentEnrollment: t.currentEnrollment + 1, updatedAt: new Date().toISOString() }
        : t
    );
    auditService.log('Coordinator', 'Added Participant', 'Participant', participant.id, `New participant enrolled in ${data.arm} arm`, data.trialId);
    return participant;
  },

  async update(id: string, data: Partial<Participant>): Promise<Participant | null> {
    await delay();
    participants = participants.map(p => p.id === id ? { ...p, ...data } : p);
    return participants.find(p => p.id === id) ?? null;
  },
};

// ─────────────────────────────────────────
// VISIT SERVICE
// ─────────────────────────────────────────
export const visitService = {
  async getByParticipant(participantId: string): Promise<Visit[]> {
    await delay();
    return visits.filter(v => v.participantId === participantId).sort((a, b) => a.visitNumber - b.visitNumber);
  },

  async getByTrial(trialId: string): Promise<Visit[]> {
    await delay();
    return visits.filter(v => v.trialId === trialId);
  },

  async getById(id: string): Promise<Visit | null> {
    await delay();
    return visits.find(v => v.id === id) ?? null;
  },

  async complete(id: string, actualDate: string): Promise<Visit | null> {
    await delay();
    visits = visits.map(v =>
      v.id === id ? { ...v, status: 'Completed', actualDate } : v
    );
    const updated = visits.find(v => v.id === id);
    if (updated) {
      auditService.log('Coordinator', 'Completed Visit', 'Visit', id, `Visit ${updated.visitName} marked complete for ${updated.participantId}`, updated.trialId);
    }
    return updated ?? null;
  },
};

// ─────────────────────────────────────────
// CRF SERVICE
// ─────────────────────────────────────────
export const crfService = {
  async getByVisit(visitId: string): Promise<CRF | null> {
    await delay();
    return crfs.find(c => c.visitId === visitId) ?? null;
  },

  async getByParticipant(participantId: string): Promise<CRF[]> {
    await delay();
    return crfs.filter(c => c.participantId === participantId);
  },

  async getByTrial(trialId: string): Promise<CRF[]> {
    await delay();
    return crfs.filter(c => c.trialId === trialId);
  },

  async update(id: string, data: Partial<CRF>): Promise<CRF | null> {
    await delay();
    crfs = crfs.map(c => c.id === id ? { ...c, ...data } : c);
    const updated = crfs.find(c => c.id === id) ?? null;
    if (updated) {
      auditService.log('Coordinator', 'Updated CRF', 'CRF', id, `CRF updated — ${updated.completionPercentage}% complete`, updated.trialId);
    }
    return updated;
  },
};

// ─────────────────────────────────────────
// AYURVEDA SERVICE
// ─────────────────────────────────────────
export const ayurvedaService = {
  async getPrakritiAssessment(participantId: string): Promise<PrakritiAssessment | null> {
    await delay();
    return prakritiAssessments.find(pa => pa.participantId === participantId) ?? null;
  },

  async savePrakritiAssessment(data: Omit<PrakritiAssessment, 'id'>): Promise<PrakritiAssessment> {
    await delay();
    const assessment: PrakritiAssessment = { ...data, id: `pa-${Date.now()}` };
    prakritiAssessments = [...prakritiAssessments.filter(p => p.participantId !== data.participantId), assessment];
    // Update participant prakriti
    const dominant = data.vataScore > data.pittaScore && data.vataScore > data.kaphaScore ? 'Vata'
      : data.pittaScore > data.kaphaScore ? 'Pitta' : 'Kapha';
    participants = participants.map(p =>
      p.id === data.participantId ? { ...p, prakriti: dominant, dominantDosha: dominant } : p
    );
    auditService.log('Coordinator', 'Completed Prakriti Assessment', 'PrakritiAssessment', assessment.id, `Prakriti assessed — Dominant: ${dominant}`, data.trialId);
    return assessment;
  },

  async getDoshaAssessments(participantId: string): Promise<DoshaAssessment[]> {
    await delay();
    return doshaAssessments
      .filter(da => da.participantId === participantId)
      .sort((a, b) => a.assessedAt.localeCompare(b.assessedAt));
  },

  async saveDoshaAssessment(data: Omit<DoshaAssessment, 'id'>): Promise<DoshaAssessment> {
    await delay();
    const assessment: DoshaAssessment = { ...data, id: `da-${Date.now()}` };
    doshaAssessments = [...doshaAssessments, assessment];
    return assessment;
  },

  async getFormulations(): Promise<Formulation[]> {
    await delay();
    return [...formulations];
  },

  async searchFormulations(query: string): Promise<Formulation[]> {
    await delay();
    const q = query.toLowerCase();
    return formulations.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.indication.toLowerCase().includes(q) ||
      f.afiCode.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  },

  async getPrakritiDistribution(trialId: string): Promise<PrakritiDistribution> {
    await delay();
    const trialParticipants = participants.filter(p => p.trialId === trialId);
    return getPrakritiDistribution(trialParticipants);
  },

  async getOutcomeByPrakriti(trialId: string): Promise<Array<{prakriti: string, avgOutcome: number, count: number}>> {
    await delay();
    const trialParticipants = participants.filter(p => p.trialId === trialId);
    const trialCRFs = crfs.filter(c => c.trialId === trialId);
    return getOutcomeByPrakriti(trialParticipants, trialCRFs);
  },

  async getDoshaTrajectory(trialId: string): Promise<DoshaTrajectoryPoint[]> {
    await delay();
    const trialDoshas = doshaAssessments.filter(da => da.trialId === trialId);
    return getAverageDoshaTrajectory(trialDoshas);
  },
};

// ─────────────────────────────────────────
// SAFETY SERVICE
// ─────────────────────────────────────────
export const safetyService = {
  async getByTrial(trialId: string): Promise<AdverseEvent[]> {
    await delay();
    return adverseEvents.filter(ae => ae.trialId === trialId);
  },

  async getById(id: string): Promise<AdverseEvent | null> {
    await delay();
    return adverseEvents.find(ae => ae.id === id) ?? null;
  },

  async getByParticipant(participantId: string): Promise<AdverseEvent[]> {
    await delay();
    return adverseEvents.filter(ae => ae.participantId === participantId);
  },

  async report(data: Omit<AdverseEvent, 'id'>): Promise<AdverseEvent> {
    await delay();
    const ae: AdverseEvent = { ...data, id: `ae-${Date.now()}` };
    adverseEvents = [...adverseEvents, ae];
    // Update participant safety status
    if (ae.isSerious) {
      participants = participants.map(p =>
        p.id === ae.participantId ? { ...p, safetyStatus: 'SAE' } : p
      );
    } else {
      participants = participants.map(p =>
        p.id === ae.participantId && p.safetyStatus === 'Normal' ? { ...p, safetyStatus: 'AE' } : p
      );
    }
    auditService.log('Safety', 'Reported Adverse Event', 'AdverseEvent', ae.id, `AE reported: ${ae.eventName} — ${ae.severity}`, ae.trialId);
    return ae;
  },

  async updateStatus(id: string, status: AdverseEvent['status'], notes: string): Promise<AdverseEvent | null> {
    await delay();
    adverseEvents = adverseEvents.map(ae =>
      ae.id === id ? { ...ae, status, reviewerNotes: notes } : ae
    );
    const updated = adverseEvents.find(ae => ae.id === id) ?? null;
    if (updated) {
      auditService.log('Safety', 'Reviewed SAE', 'AdverseEvent', id, `Status updated to ${status}`, updated.trialId);
    }
    return updated;
  },

  async getPrioritized(trialId: string): Promise<Record<string, AdverseEvent[]>> {
    await delay();
    const trialAEs = adverseEvents.filter(ae => ae.trialId === trialId);
    return {
      Critical: trialAEs.filter(ae => ae.priority === 'Critical'),
      High: trialAEs.filter(ae => ae.priority === 'High'),
      Review: trialAEs.filter(ae => ae.priority === 'Review'),
      Routine: trialAEs.filter(ae => ae.priority === 'Routine'),
    };
  },
};

// ─────────────────────────────────────────
// ETHICS SERVICE
// ─────────────────────────────────────────
export const ethicsService = {
  async getByTrial(trialId: string): Promise<EthicsReview | null> {
    await delay();
    return ethics.find(e => e.trialId === trialId) ?? null;
  },

  async submit(trialId: string): Promise<EthicsReview> {
    await delay();
    const existing = ethics.find(e => e.trialId === trialId);
    const now = new Date().toISOString().split('T')[0];
    if (existing) {
      const updated = {
        ...existing,
        status: 'SUBMITTED' as const,
        submissionDate: now,
        timeline: [...existing.timeline, { date: now, event: 'Protocol re-submitted for review', actor: 'PI', type: 'submission' as const }]
      };
      ethics = ethics.map(e => e.trialId === trialId ? updated : e);
      return updated;
    }
    const newReview: EthicsReview = {
      id: `eth-${Date.now()}`,
      trialId,
      status: 'SUBMITTED',
      approvalNumber: '',
      approvalDate: null,
      expiryDate: null,
      submissionDate: now,
      reviewerNotes: '',
      timeline: [{ date: now, event: 'Protocol submitted for IEC review', actor: 'PI', type: 'submission' }]
    };
    ethics = [...ethics, newReview];
    auditService.log('PI', 'Submitted Ethics', 'EthicsReview', newReview.id, 'Protocol submitted to IEC', trialId);
    return newReview;
  },

  async approve(id: string, approvalNumber: string, expiryDate: string): Promise<EthicsReview | null> {
    await delay();
    const now = new Date().toISOString().split('T')[0];
    ethics = ethics.map(e =>
      e.id === id ? {
        ...e, status: 'APPROVED' as const,
        approvalNumber, approvalDate: now, expiryDate,
        timeline: [...e.timeline, { date: now, event: `Ethics approved — ${approvalNumber}`, actor: 'IEC Committee', type: 'approval' as const }]
      } : e
    );
    const updated = ethics.find(e => e.id === id) ?? null;
    if (updated) auditService.log('Ethics', 'Approved Ethics', 'EthicsReview', id, `Approval granted: ${approvalNumber}`, updated.trialId);
    return updated;
  },

  async reject(id: string, notes: string): Promise<EthicsReview | null> {
    await delay();
    const now = new Date().toISOString().split('T')[0];
    ethics = ethics.map(e =>
      e.id === id ? {
        ...e, status: 'REJECTED' as const, reviewerNotes: notes,
        timeline: [...e.timeline, { date: now, event: 'Ethics rejected — see reviewer notes', actor: 'IEC Committee', type: 'rejection' as const }]
      } : e
    );
    return ethics.find(e => e.id === id) ?? null;
  },
};

// ─────────────────────────────────────────
// COMPLIANCE SERVICE
// ─────────────────────────────────────────
export const complianceService = {
  async getByTrial(trialId: string): Promise<ComplianceItem[]> {
    await delay();
    return complianceItems.filter(ci => ci.trialId === trialId);
  },

  async update(id: string, data: Partial<ComplianceItem>): Promise<ComplianceItem | null> {
    await delay();
    complianceItems = complianceItems.map(ci =>
      ci.id === id ? { ...ci, ...data, lastUpdated: new Date().toISOString().split('T')[0] } : ci
    );
    return complianceItems.find(ci => ci.id === id) ?? null;
  },
};

// ─────────────────────────────────────────
// INTELLIGENCE SERVICE
// ─────────────────────────────────────────
export const intelligenceService = {
  async getAlerts(trialId: string): Promise<Alert[]> {
    await delay();
    const trial = trials.find(t => t.id === trialId);
    const ethicsReview = ethics.find(e => e.trialId === trialId);
    if (!trial || !ethicsReview) return [];
    const trialParticipants = participants.filter(p => p.trialId === trialId);
    const trialVisits = visits.filter(v => v.trialId === trialId);
    const trialCRFs = crfs.filter(c => c.trialId === trialId);
    const trialAEs = adverseEvents.filter(ae => ae.trialId === trialId);
    return generateAlerts(trial, ethicsReview, trialParticipants, trialVisits, trialCRFs, trialAEs);
  },

  async getTrialHealth(trialId: string): Promise<TrialHealthScore> {
    await delay();
    const trial = trials.find(t => t.id === trialId);
    if (!trial) return { overall: 0, label: 'Critical', enrollment: 0, followUp: 0, dataQuality: 0, safety: 0, compliance: 0 };
    const trialParticipants = participants.filter(p => p.trialId === trialId);
    const trialVisits = visits.filter(v => v.trialId === trialId);
    const trialCRFs = crfs.filter(c => c.trialId === trialId);
    const trialAEs = adverseEvents.filter(ae => ae.trialId === trialId);
    const trialCompliance = complianceItems.filter(ci => ci.trialId === trialId);
    return calculateTrialHealth(trial, trialParticipants, trialVisits, trialCRFs, trialAEs, trialCompliance);
  },
};

// ─────────────────────────────────────────
// FHIR SERVICE
// ─────────────────────────────────────────
export const fhirService = {
  async generateBundle(trialId: string): Promise<object> {
    await delay(800); // Simulate processing
    const trial = trials.find(t => t.id === trialId);
    const trialParticipants = participants.filter(p => p.trialId === trialId);
    const trialVisits = visits.filter(v => v.trialId === trialId && v.status === 'Completed');
    const trialAEs = adverseEvents.filter(ae => ae.trialId === trialId);
    const trialCRFs = crfs.filter(c => c.trialId === trialId && c.completedAt !== null);

    const entries: object[] = [];

    // Patients
    trialParticipants.forEach(p => {
      entries.push({
        fullUrl: `urn:uuid:patient-${p.id}`,
        resource: {
          resourceType: 'Patient',
          id: p.id,
          meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
          identifier: [{ system: 'urn:surtamind:participant', value: p.id }],
          gender: p.sex === 'M' ? 'male' : p.sex === 'F' ? 'female' : 'other',
          birthDate: `${new Date().getFullYear() - p.age}-01-01`,
          extension: [
            { url: 'urn:surtamind:prakriti', valueString: p.prakriti },
            { url: 'urn:surtamind:trial-arm', valueString: p.arm },
          ]
        }
      });
    });

    // Encounters (visits)
    trialVisits.forEach(v => {
      entries.push({
        fullUrl: `urn:uuid:encounter-${v.id}`,
        resource: {
          resourceType: 'Encounter',
          id: v.id,
          status: 'finished',
          class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB' },
          subject: { reference: `urn:uuid:patient-${v.participantId}` },
          period: { start: v.actualDate || v.scheduledDate },
          type: [{ coding: [{ display: v.visitName }] }]
        }
      });
    });

    // Observations (primary outcome per CRF)
    trialCRFs.forEach(crf => {
      if (crf.outcomes.primaryOutcomeValue !== null) {
        entries.push({
          fullUrl: `urn:uuid:obs-${crf.id}`,
          resource: {
            resourceType: 'Observation',
            id: `obs-${crf.id}`,
            status: 'final',
            code: { coding: [{ system: 'http://loinc.org', code: '72133-2', display: 'MMSE Score' }] },
            subject: { reference: `urn:uuid:patient-${crf.participantId}` },
            encounter: { reference: `urn:uuid:encounter-${crf.visitId}` },
            valueQuantity: { value: crf.outcomes.primaryOutcomeValue, unit: 'score' },
            effectiveDateTime: crf.completedAt
          }
        });
      }
    });

    // AdverseEvents
    trialAEs.forEach(ae => {
      entries.push({
        fullUrl: `urn:uuid:ae-${ae.id}`,
        resource: {
          resourceType: 'AdverseEvent',
          id: ae.id,
          status: ae.status === 'Closed' ? 'completed' : 'in-progress',
          actuality: 'actual',
          category: [{ coding: [{ display: ae.severity }] }],
          event: { coding: [{ display: ae.eventName }] },
          subject: { reference: `urn:uuid:patient-${ae.participantId}` },
          date: ae.reportedDate,
          seriousness: ae.isSerious ? { coding: [{ code: 'Serious', display: 'Serious' }] } : undefined,
          causality: [{ assessment: { coding: [{ display: ae.causality }] } }]
        }
      });
    });

    auditService.log('PI', 'Generated FHIR Bundle', 'Trial', trialId, `FHIR R4 Bundle generated: ${trialParticipants.length} patients, ${trialVisits.length} encounters, ${trialCRFs.length} observations, ${trialAEs.length} adverse events`, trialId);

    return {
      resourceType: 'Bundle',
      id: `surtamind-${trialId}-${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString(),
        tag: [{ system: 'urn:surtamind', code: 'export', display: 'SURTAMIND Export' }]
      },
      type: 'collection',
      timestamp: new Date().toISOString(),
      total: entries.length,
      entry: entries,
    };
  },
};

// ─────────────────────────────────────────
// AUDIT SERVICE
// ─────────────────────────────────────────
export const auditService = {
  log(
    role: string, action: string, entityType: string,
    entityId: string, details: string, trialId: string | null = null
  ) {
    const entry: AuditLog = {
      id: `al-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      timestamp: new Date().toISOString(),
      userId: 'current-user',
      userName: 'Current User',
      userRole: role as AuditLog['userRole'],
      action, entityType, entityId, details,
      trialId,
    };
    auditLogs = [entry, ...auditLogs];
  },

  async getAll(trialId?: string): Promise<AuditLog[]> {
    await delay();
    const logs = trialId ? auditLogs.filter(al => al.trialId === trialId || al.trialId === null) : auditLogs;
    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
};

// ─────────────────────────────────────────
// USER SERVICE
// ─────────────────────────────────────────
export const userService = {
  async getAll(): Promise<User[]> {
    return [...DEMO_USERS];
  },

  async getByRole(role: User['role']): Promise<User | null> {
    return DEMO_USERS.find(u => u.role === role) ?? null;
  },
};
