// ═══════════════════════════════════════════════════════════
// SURTAMIND — Domain Types
// ═══════════════════════════════════════════════════════════

export type UserRole = 'PI' | 'Coordinator' | 'Ethics' | 'Safety';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  initials: string;
}

export type TrialStatus =
  | 'DRAFT'
  | 'ETHICS_SUBMITTED'
  | 'ETHICS_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CLOSED';

export type StudyPhase = 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Pilot';
export type StudyType = 'Interventional' | 'Observational' | 'Retrospective';

export interface Trial {
  id: string;
  trialId: string;         // e.g. "AYU-001"
  title: string;
  shortTitle: string;
  principalInvestigator: string;
  studyType: StudyType;
  phase: StudyPhase;
  condition: string;
  objective: string;
  primaryOutcome: string;
  secondaryOutcomes: string[];
  intervention: string;
  comparator: string;
  durationWeeks: number;
  targetEnrollment: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  status: TrialStatus;
  // Ayurveda-specific
  ayurvedicIntervention: string;
  afiReference: string;
  ayurvedicDiagnosis: string;
  doshaConsideration: string;
  // Ethics
  ethicsStatus: EthicsStatus;
  createdAt: string;
  updatedAt: string;
}

export type EthicsStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'
  | 'RENEWAL_DUE';

export interface EthicsReview {
  id: string;
  trialId: string;
  status: EthicsStatus;
  approvalNumber: string;
  approvalDate: string | null;
  expiryDate: string | null;
  submissionDate: string;
  reviewerNotes: string;
  timeline: EthicsTimelineEvent[];
}

export interface EthicsTimelineEvent {
  date: string;
  event: string;
  actor: string;
  type: 'submission' | 'review' | 'approval' | 'rejection' | 'renewal';
}

export type PrakritiType = 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Sama';
export type ParticipantStatus = 'Screening' | 'Enrolled' | 'Active' | 'Withdrawn' | 'Completed' | 'Lost to Follow-up';
export type Sex = 'M' | 'F' | 'Other';

export interface Participant {
  id: string;           // e.g. "P-001"
  trialId: string;
  name: string;         // Fictional only
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  enrollmentDate: string;
  arm: 'Treatment' | 'Control';
  status: ParticipantStatus;
  screeningStatus: 'Pending' | 'Pass' | 'Fail';
  prakriti: PrakritiType | null;
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | null;
  ayurvedicDiagnosis: string;
  currentFormulationId: string | null;
  safetyStatus: 'Normal' | 'AE' | 'SAE';
  lastVisitDate: string | null;
  lastVisitNumber: number;
  totalVisits: number;
}

export interface Visit {
  id: string;
  participantId: string;
  trialId: string;
  visitNumber: number;
  visitName: string;   // e.g. "Screening", "Week 2"
  scheduledDate: string;
  actualDate: string | null;
  status: 'Completed' | 'Due' | 'Overdue' | 'Upcoming' | 'Missed';
  crfId: string | null;
  doshaAssessmentId: string | null;
  notes: string;
}

export interface CRF {
  id: string;
  visitId: string;
  participantId: string;
  trialId: string;
  completedAt: string | null;
  completionPercentage: number;
  // Demographics
  demographics: {
    occupation: string;
    education: string;
    diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
  };
  // Vitals
  vitals: {
    bloodPressureSystolic: number | null;
    bloodPressureDiastolic: number | null;
    pulseRate: number | null;
    temperature: number | null;
    weight: number | null;
    height: number | null;
  };
  // Clinical
  clinicalAssessment: {
    chiefComplaint: string;
    presentIllness: string;
    pastHistory: string;
    physicalExam: string;
  };
  // Ayurveda
  ayurvedaAssessment: {
    prakritiVata: number;
    prakritiPitta: number;
    prakritiKapha: number;
    vikrutiVata: number;
    vikrutiPitta: number;
    vikrutiKapha: number;
    agni: 'Sama' | 'Vishama' | 'Tikshna' | 'Manda';
    koshtha: 'Mridu' | 'Madhya' | 'Krura';
  };
  // Treatment
  treatment: {
    formulationId: string;
    doseMg: number;
    frequency: string;
    duration: string;
    compliance: number; // 0-100
  };
  // Outcomes
  outcomes: {
    primaryOutcomeValue: number | null;
    primaryOutcomeUnit: string;
    secondaryOutcome1: number | null;
    secondaryOutcome2: number | null;
    patientGlobalAssessment: number | null; // 0-10 VAS
    physicianGlobalAssessment: number | null;
  };
  // Safety
  safety: {
    adverseEventsThisVisit: string[];
    concomitantMedications: string;
    pregnancyStatus: 'NA' | 'Not Pregnant' | 'Pregnant';
  };
  missingRequiredFields: string[];
}

export interface PrakritiAssessment {
  id: string;
  participantId: string;
  trialId: string;
  assessedAt: string;
  vataScore: number;   // 0-100
  pittaScore: number;
  kaphaScore: number;
  dominantPrakriti: 'Vata' | 'Pitta' | 'Kapha';
  answers: Record<string, string>;
}

export interface DoshaAssessment {
  id: string;
  participantId: string;
  visitId: string;
  trialId: string;
  assessedAt: string;
  vataScore: number;  // 0-10
  pittaScore: number;
  kaphaScore: number;
}

export interface Formulation {
  id: string;
  name: string;
  afiCode: string;
  rasa: string[];       // e.g. ["Tikta","Kashaya"]
  guna: string[];
  virya: 'Ushna' | 'Sheeta';
  vipaka: 'Madhura' | 'Amla' | 'Katu';
  indication: string;
  doshaEffect: {
    vata: 'Increases' | 'Decreases' | 'Neutral';
    pitta: 'Increases' | 'Decreases' | 'Neutral';
    kapha: 'Increases' | 'Decreases' | 'Neutral';
  };
  category: string;
  description: string;
}

export type AESeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening' | 'Fatal';
export type AEStatus = 'Open' | 'Under Review' | 'Closed';
export type AECausality = 'Unrelated' | 'Unlikely' | 'Possible' | 'Probable' | 'Definite';
export type SAEPriority = 'Critical' | 'High' | 'Review' | 'Routine';

export interface AdverseEvent {
  id: string;
  participantId: string;
  trialId: string;
  reportedDate: string;
  eventName: string;
  description: string;
  severity: AESeverity;
  isSerious: boolean;
  isExpected: boolean;
  causality: AECausality;
  actionTaken: string;
  outcome: string;
  status: AEStatus;
  reviewerNotes: string;
  resolvedDate: string | null;
  deadlineDays: number | null;
  priority: SAEPriority;
}

export type ComplianceItemStatus = 'Compliant' | 'Warning' | 'Non-Compliant' | 'Pending';

export interface ComplianceItem {
  id: string;
  trialId: string;
  requirement: string;
  category: 'Protocol' | 'Ethics' | 'Safety' | 'Documentation' | 'Regulatory' | 'Data';
  status: ComplianceItemStatus;
  owner: string;
  dueDate: string | null;
  lastUpdated: string;
  notes: string;
}

export type AlertType =
  | 'SAE_REVIEW'
  | 'ETHICS_RENEWAL'
  | 'OVERDUE_VISIT'
  | 'MISSING_CRF'
  | 'SAFETY_REVIEW'
  | 'DATA_QUALITY'
  | 'ENROLLMENT';

export type AlertPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Alert {
  id: string;
  trialId: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  count: number;
  entityType: string;
  entityIds: string[];
  navigateTo: string;
  createdAt: string;
  isResolved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  trialId: string | null;
}

export interface TrialHealthScore {
  overall: number;
  label: 'Healthy' | 'Needs Attention' | 'At Risk' | 'Critical';
  enrollment: number;
  followUp: number;
  dataQuality: number;
  safety: number;
  compliance: number;
}

export interface PrakritiDistribution {
  vata: number;
  pitta: number;
  kapha: number;
  vataPitta: number;
  pittaKapha: number;
  vataKapha: number;
  sama: number;
}

export interface DoshaTrajectoryPoint {
  visit: string;
  vata: number;
  pitta: number;
  kapha: number;
}
