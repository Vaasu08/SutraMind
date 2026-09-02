// ═══════════════════════════════════════════════════════════
// SURTAMIND — Complete Demo Seed Dataset
// Fictional data only — no real patient information
// ═══════════════════════════════════════════════════════════

import type {
  Trial, EthicsReview, Participant, Visit, CRF,
  PrakritiAssessment, DoshaAssessment, Formulation,
  AdverseEvent, ComplianceItem, AuditLog, Alert, User
} from '../types/domain';

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────
export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Dr. Priya Sharma', role: 'PI', email: 'priya.sharma@aiia.gov.in', initials: 'PS' },
  { id: 'u2', name: 'Rahul Mehta', role: 'Coordinator', email: 'rahul.mehta@aiia.gov.in', initials: 'RM' },
  { id: 'u3', name: 'Dr. Anjali Rao', role: 'Ethics', email: 'anjali.rao@iec.gov.in', initials: 'AR' },
  { id: 'u4', name: 'Vikram Singh', role: 'Safety', email: 'vikram.singh@aiia.gov.in', initials: 'VS' },
];

// ─────────────────────────────────────────
// FORMULATION LIBRARY
// ─────────────────────────────────────────
export const FORMULATIONS: Formulation[] = [
  {
    id: 'f1', name: 'Ashwagandha Ghana Vati', afiCode: 'AFI-PS-0014',
    rasa: ['Tikta', 'Kashaya'], guna: ['Laghu', 'Snigdha'],
    virya: 'Ushna', vipaka: 'Madhura',
    indication: 'Anxiety, fatigue, cognitive impairment, adaptogenic support',
    doshaEffect: { vata: 'Decreases', pitta: 'Neutral', kapha: 'Decreases' },
    category: 'Rasayana', description: 'Standardized Ashwagandha extract 500mg per tablet. Classical adaptogen with modern clinical evidence.'
  },
  {
    id: 'f2', name: 'Brahmi Vati', afiCode: 'AFI-PS-0022',
    rasa: ['Tikta', 'Kashaya', 'Madhura'], guna: ['Laghu', 'Sara'],
    virya: 'Sheeta', vipaka: 'Madhura',
    indication: 'Cognitive enhancement, memory, anxiety, epilepsy support',
    doshaEffect: { vata: 'Decreases', pitta: 'Decreases', kapha: 'Neutral' },
    category: 'Medhya Rasayana', description: 'Bacopa monnieri extract standardized to 20% bacosides. Primary nootropic agent.'
  },
  {
    id: 'f3', name: 'Triphala Churna', afiCode: 'AFI-SF-0056',
    rasa: ['Tikta', 'Kashaya', 'Amla', 'Madhura', 'Katu'], guna: ['Laghu', 'Ruksha'],
    virya: 'Ushna', vipaka: 'Madhura',
    indication: 'Digestive disorders, constipation, metabolic syndrome, antioxidant',
    doshaEffect: { vata: 'Decreases', pitta: 'Decreases', kapha: 'Decreases' },
    category: 'Tridoshic', description: 'Classical Triphala — Amalaki, Bibhitaki, Haritaki in equal proportions.'
  },
  {
    id: 'f4', name: 'Guduchi Satva', afiCode: 'AFI-PS-0031',
    rasa: ['Tikta', 'Kashaya', 'Madhura'], guna: ['Guru', 'Snigdha'],
    virya: 'Ushna', vipaka: 'Madhura',
    indication: 'Immune modulation, chronic fever, metabolic disorders, anti-inflammatory',
    doshaEffect: { vata: 'Decreases', pitta: 'Decreases', kapha: 'Neutral' },
    category: 'Immunomodulator', description: 'Tinospora cordifolia starch extract. Potent immunomodulatory agent.'
  },
  {
    id: 'f5', name: 'Shatavari Churna', afiCode: 'AFI-PS-0048',
    rasa: ['Madhura', 'Tikta'], guna: ['Guru', 'Snigdha'],
    virya: 'Sheeta', vipaka: 'Madhura',
    indication: 'Female reproductive health, hormonal balance, adaptogen for Pitta constitution',
    doshaEffect: { vata: 'Decreases', pitta: 'Decreases', kapha: 'Increases' },
    category: 'Stree Rasayana', description: 'Asparagus racemosus root powder. Female adaptogen and galactagogue.'
  },
  {
    id: 'f6', name: 'Placebo Churna', afiCode: 'PLACEBO-001',
    rasa: ['Madhura'], guna: ['Laghu'],
    virya: 'Sheeta', vipaka: 'Madhura',
    indication: 'Control arm — inert excipient only',
    doshaEffect: { vata: 'Neutral', pitta: 'Neutral', kapha: 'Neutral' },
    category: 'Control', description: 'Lactose monohydrate and starch excipient. Identical appearance to active arm.'
  },
];

// ─────────────────────────────────────────
// TRIAL AYU-001
// ─────────────────────────────────────────
export const TRIAL_AYU001: Trial = {
  id: 'trial-001',
  trialId: 'AYU-001',
  title: 'Efficacy of Ashwagandha-Based Polyherbal Formulation in Cognitive Impairment: A Randomized Double-Blind Placebo-Controlled Trial',
  shortTitle: 'Ashwagandha Cognitive Study',
  principalInvestigator: 'Dr. Priya Sharma',
  studyType: 'Interventional',
  phase: 'Phase III',
  condition: 'Mild Cognitive Impairment (Smriti-bhransha)',
  objective: 'To evaluate the safety and efficacy of Ashwagandha Ghana Vati (500mg BD) versus placebo in reducing cognitive decline scores over 12 weeks in participants aged 45–70 with mild cognitive impairment.',
  primaryOutcome: 'Change from baseline in MMSE score at Week 12',
  secondaryOutcomes: [
    'Change in Rey Auditory Verbal Learning Test (RAVLT)',
    'Change in Hamilton Anxiety Scale (HAM-A)',
    'Change in Pittsburgh Sleep Quality Index (PSQI)',
    'Dosha normalization index at Week 12'
  ],
  intervention: 'Ashwagandha Ghana Vati 500mg twice daily for 12 weeks',
  comparator: 'Placebo Churna 500mg twice daily for 12 weeks',
  durationWeeks: 12,
  targetEnrollment: 100,
  currentEnrollment: 84,
  startDate: '2026-03-01',
  endDate: '2026-12-31',
  status: 'ACTIVE',
  ayurvedicIntervention: 'Ashwagandha Ghana Vati (standardized extract — 5% withanolides)',
  afiReference: 'API Part I, Vol. III — Ashwagandha; AFI Part II — Ghana Vati preparation',
  ayurvedicDiagnosis: 'Smriti-bhransha (memory impairment) with predominant Vata-Kapha imbalance',
  doshaConsideration: 'Vata-dominant participants expected to show greater response (adaptogen targeting Vata-type cognitive decline)',
  ethicsStatus: 'APPROVED',
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-08-28T14:30:00Z',
};

// ─────────────────────────────────────────
// ETHICS REVIEW
// ─────────────────────────────────────────
export const ETHICS_REVIEW: EthicsReview = {
  id: 'eth-001',
  trialId: 'trial-001',
  status: 'APPROVED',
  approvalNumber: 'IEC/AIIA/2026/001',
  approvalDate: '2026-02-12',
  expiryDate: '2026-09-23',  // ~21 days from now — triggers alert
  submissionDate: '2026-01-28',
  reviewerNotes: 'Protocol approved with minor modifications. SAE reporting timeline updated to 24h for serious events.',
  timeline: [
    { date: '2026-01-28', event: 'Protocol submitted for IEC review', actor: 'Dr. Priya Sharma', type: 'submission' },
    { date: '2026-02-02', event: 'Initial review commenced', actor: 'IEC Secretariat', type: 'review' },
    { date: '2026-02-05', event: 'Clarification requested on SAE reporting timeline', actor: 'Dr. Anjali Rao', type: 'review' },
    { date: '2026-02-08', event: 'Clarification submitted by PI', actor: 'Dr. Priya Sharma', type: 'submission' },
    { date: '2026-02-12', event: 'Ethics approval granted — IEC/AIIA/2026/001', actor: 'IEC Committee', type: 'approval' },
    { date: '2026-08-20', event: 'Renewal reminder issued — expiry in 23 days', actor: 'System', type: 'renewal' },
  ]
};

// ─────────────────────────────────────────
// PARTICIPANTS (84 total, sample of key ones + bulk generated)
// ─────────────────────────────────────────

const generateParticipants = (): Participant[] => {
  const firstNames = ['Arjun','Priya','Ravi','Sunita','Manish','Kavitha','Deepak','Anita','Suresh','Meera',
    'Ramesh','Lakshmi','Vijay','Usha','Anil','Pooja','Sanjay','Radha','Ashok','Geeta','Mohan','Sita',
    'Rajesh','Kamla','Dinesh','Sarita','Vinod','Nirmala','Sunil','Rekha','Harish','Shakuntala','Pankaj',
    'Savita','Naveen','Pushpa','Ajay','Seema','Rohit','Mamta','Varun','Saroj','Tarun','Kiran','Gaurav',
    'Sudha','Nitin','Parvati','Rakesh','Champa','Hemant','Indira','Vivek','Jyoti','Mukesh','Sushila'];
  const lastNames = ['Sharma','Patel','Singh','Gupta','Kumar','Rao','Joshi','Nair','Iyer','Menon',
    'Agarwal','Saxena','Verma','Bose','Das','Chakraborty','Mukherjee','Reddy','Pillai','Mishra'];

  const prakritiTypes: Array<Participant['prakriti']> = ['Vata','Pitta','Kapha','Vata-Pitta','Pitta-Kapha','Vata-Kapha'];
  const prakritiWeights = [0.32, 0.25, 0.18, 0.12, 0.08, 0.05];

  function weightedPrakriti(): Participant['prakriti'] {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < prakritiTypes.length; i++) {
      cumulative += prakritiWeights[i];
      if (r < cumulative) return prakritiTypes[i];
    }
    return 'Vata';
  }

  const participants: Participant[] = [];

  for (let i = 1; i <= 84; i++) {
    const id = `P-${String(i).padStart(3,'0')}`;
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[(i - 1) % lastNames.length];
    const sex: Participant['sex'] = i % 3 === 0 ? 'M' : i % 5 === 0 ? 'M' : 'F';
    const age = 45 + Math.floor((i * 7) % 26);
    const prakriti = weightedPrakriti();
    const dominant = prakriti?.includes('Vata') ? 'Vata' : prakriti?.includes('Pitta') ? 'Pitta' : 'Kapha';
    const visitNum = Math.min(Math.floor(i / 10) + 1, 4);

    // Specific participants for demo narrative
    let safetyStatus: Participant['safetyStatus'] = 'Normal';
    if (i === 42) safetyStatus = 'SAE';
    else if ([7, 19, 33, 55, 71].includes(i)) safetyStatus = 'AE';

    const isOverdue = [3, 8, 15, 22, 31, 44, 58].includes(i);
    const status: Participant['status'] = i > 80 ? 'Screening' : 'Enrolled';

    participants.push({
      id, trialId: 'trial-001',
      name: `${firstName} ${lastName}`,
      age, sex,
      heightCm: sex === 'M' ? 162 + (i % 18) : 151 + (i % 16),
      weightKg: 52 + (i % 38),
      enrollmentDate: `2026-0${3 + Math.floor(i/30)}-${String(1 + (i % 28)).padStart(2,'0')}`,
      arm: i % 2 === 0 ? 'Treatment' : 'Control',
      status,
      screeningStatus: 'Pass',
      prakriti,
      dominantDosha: dominant,
      ayurvedicDiagnosis: 'Smriti-bhransha with Vata-Kapha imbalance',
      currentFormulationId: i % 2 === 0 ? 'f1' : 'f6',
      safetyStatus,
      lastVisitDate: isOverdue ? '2026-07-15' : `2026-08-${String(10 + (i % 18)).padStart(2,'0')}`,
      lastVisitNumber: visitNum,
      totalVisits: 4,
    });
  }

  return participants;
};

export const PARTICIPANTS: Participant[] = generateParticipants();

// ─────────────────────────────────────────
// VISITS (for participant P-042 — demo star)
// ─────────────────────────────────────────
export const VISITS_P042: Visit[] = [
  {
    id: 'v-042-1', participantId: 'P-042', trialId: 'trial-001',
    visitNumber: 1, visitName: 'Screening / Baseline',
    scheduledDate: '2026-04-10', actualDate: '2026-04-10',
    status: 'Completed', crfId: 'crf-042-1', doshaAssessmentId: 'da-042-1',
    notes: 'Baseline assessment complete. MMSE: 23. Informed consent obtained.'
  },
  {
    id: 'v-042-2', participantId: 'P-042', trialId: 'trial-001',
    visitNumber: 2, visitName: 'Week 4',
    scheduledDate: '2026-05-08', actualDate: '2026-05-09',
    status: 'Completed', crfId: 'crf-042-2', doshaAssessmentId: 'da-042-2',
    notes: 'Visit completed with 1 day delay. SAE reported — allergic reaction to concomitant medication (NOT to study drug).'
  },
  {
    id: 'v-042-3', participantId: 'P-042', trialId: 'trial-001',
    visitNumber: 3, visitName: 'Week 8',
    scheduledDate: '2026-06-05', actualDate: '2026-06-05',
    status: 'Completed', crfId: 'crf-042-3', doshaAssessmentId: 'da-042-3',
    notes: 'SAE resolved. Participant continuing on treatment arm. MMSE improved to 26.'
  },
  {
    id: 'v-042-4', participantId: 'P-042', trialId: 'trial-001',
    visitNumber: 4, visitName: 'Week 12 (Final)',
    scheduledDate: '2026-09-15', actualDate: null,
    status: 'Upcoming', crfId: null, doshaAssessmentId: null,
    notes: 'Final study visit — MMSE, RAVLT, HAM-A, PSQI to be collected.'
  },
];

// ─────────────────────────────────────────
// CRFs (sample for P-042)
// ─────────────────────────────────────────
export const CRF_P042_V1: CRF = {
  id: 'crf-042-1', visitId: 'v-042-1', participantId: 'P-042', trialId: 'trial-001',
  completedAt: '2026-04-10T16:30:00Z',
  completionPercentage: 100,
  demographics: { occupation: 'Teacher', education: 'Graduate', diet: 'Vegetarian' },
  vitals: { bloodPressureSystolic: 128, bloodPressureDiastolic: 82, pulseRate: 74, temperature: 98.4, weight: 68, height: 162 },
  clinicalAssessment: {
    chiefComplaint: 'Forgetfulness for 2 years, difficulty concentrating',
    presentIllness: 'Gradual onset cognitive decline, sleep disturbances',
    pastHistory: 'Hypertension (controlled), no diabetes',
    physicalExam: 'Conscious, oriented x3. No focal neurological deficits.'
  },
  ayurvedaAssessment: {
    prakritiVata: 58, prakritiPitta: 28, prakritiKapha: 14,
    vikrutiVata: 7, vikrutiPitta: 4, vikrutiKapha: 2,
    agni: 'Vishama', koshtha: 'Krura'
  },
  treatment: { formulationId: 'f1', doseMg: 500, frequency: 'Twice daily', duration: '12 weeks', compliance: 100 },
  outcomes: {
    primaryOutcomeValue: 23, primaryOutcomeUnit: 'MMSE score',
    secondaryOutcome1: 32, secondaryOutcome2: 18,
    patientGlobalAssessment: 4, physicianGlobalAssessment: 4
  },
  safety: { adverseEventsThisVisit: [], concomitantMedications: 'Amlodipine 5mg OD', pregnancyStatus: 'NA' },
  missingRequiredFields: []
};

export const CRF_P042_V2: CRF = {
  id: 'crf-042-2', visitId: 'v-042-2', participantId: 'P-042', trialId: 'trial-001',
  completedAt: '2026-05-09T17:15:00Z',
  completionPercentage: 88,
  demographics: { occupation: 'Teacher', education: 'Graduate', diet: 'Vegetarian' },
  vitals: { bloodPressureSystolic: 124, bloodPressureDiastolic: 80, pulseRate: 72, temperature: 98.2, weight: 67.5, height: 162 },
  clinicalAssessment: {
    chiefComplaint: 'Mild improvement reported. Allergic rash noted (concomitant medication)',
    presentIllness: 'Moderate allergic reaction to Amlodipine — SAE reported',
    pastHistory: 'Hypertension (controlled)',
    physicalExam: 'Urticarial rash on trunk and arms. BP 120/78.'
  },
  ayurvedaAssessment: {
    prakritiVata: 58, prakritiPitta: 28, prakritiKapha: 14,
    vikrutiVata: 6, vikrutiPitta: 5, vikrutiKapha: 2,
    agni: 'Vishama', koshtha: 'Krura'
  },
  treatment: { formulationId: 'f1', doseMg: 500, frequency: 'Twice daily', duration: '12 weeks', compliance: 93 },
  outcomes: {
    primaryOutcomeValue: 24, primaryOutcomeUnit: 'MMSE score',
    secondaryOutcome1: 35, secondaryOutcome2: null,
    patientGlobalAssessment: 5, physicianGlobalAssessment: 5
  },
  safety: { adverseEventsThisVisit: ['ae-042-1'], concomitantMedications: 'Amlodipine discontinued, Telmisartan 40mg started', pregnancyStatus: 'NA' },
  missingRequiredFields: ['secondaryOutcome2']
};

// Generate bulk CRFs for 84 participants (simplified)
const generateBulkCRFs = (): CRF[] => {
  const crfs: CRF[] = [CRF_P042_V1, CRF_P042_V2];
  const missingFieldsPool = ['secondaryOutcome2','patientGlobalAssessment','physicianGlobalAssessment','bloodPressureDiastolic'];

  // Participants with incomplete CRFs (12 participants)
  const incompleteParticipants = new Set([3,7,11,18,23,29,34,41,51,62,70,79]);

  for (let i = 1; i <= 84; i++) {
    if (i === 42) continue; // Already added
    const pid = `P-${String(i).padStart(3,'0')}`;
    const visits = Math.min(Math.floor(i / 10) + 1, 3);

    for (let v = 1; v <= visits; v++) {
      const hasMissing = incompleteParticipants.has(i) && v === visits;
      const missing = hasMissing ? [missingFieldsPool[i % missingFieldsPool.length]] : [];
      crfs.push({
        id: `crf-${pid}-v${v}`,
        visitId: `v-${pid}-${v}`,
        participantId: pid,
        trialId: 'trial-001',
        completedAt: hasMissing ? null : `2026-0${3 + v}-15T14:00:00Z`,
        completionPercentage: hasMissing ? 72 + (i % 15) : 95 + (i % 5),
        demographics: { occupation: 'Various', education: 'Graduate', diet: 'Vegetarian' },
        vitals: {
          bloodPressureSystolic: 118 + (i % 20),
          bloodPressureDiastolic: hasMissing && missing.includes('bloodPressureDiastolic') ? null : 76 + (i % 12),
          pulseRate: 68 + (i % 16),
          temperature: 98.0 + ((i % 8) * 0.1),
          weight: 55 + (i % 35),
          height: 152 + (i % 24)
        },
        clinicalAssessment: {
          chiefComplaint: 'Cognitive complaints as per protocol',
          presentIllness: 'Per protocol',
          pastHistory: 'Per enrollment criteria',
          physicalExam: 'Within normal limits'
        },
        ayurvedaAssessment: {
          prakritiVata: 35 + (i % 40), prakritiPitta: 20 + (i % 30), prakritiKapha: 10 + (i % 30),
          vikrutiVata: 4 + (i % 5), vikrutiPitta: 2 + (i % 4), vikrutiKapha: 1 + (i % 3),
          agni: ['Sama','Vishama','Tikshna','Manda'][i % 4] as 'Sama',
          koshtha: ['Mridu','Madhya','Krura'][i % 3] as 'Mridu'
        },
        treatment: {
          formulationId: i % 2 === 0 ? 'f1' : 'f6',
          doseMg: 500, frequency: 'Twice daily', duration: '12 weeks',
          compliance: 82 + (i % 15)
        },
        outcomes: {
          primaryOutcomeValue: 21 + (i % 8), primaryOutcomeUnit: 'MMSE score',
          secondaryOutcome1: hasMissing && missing.includes('secondaryOutcome2') ? 28 + (i % 10) : 30 + (i % 12),
          secondaryOutcome2: hasMissing && missing.includes('secondaryOutcome2') ? null : 14 + (i % 8),
          patientGlobalAssessment: hasMissing && missing.includes('patientGlobalAssessment') ? null : 4 + (i % 5),
          physicianGlobalAssessment: hasMissing && missing.includes('physicianGlobalAssessment') ? null : 4 + (i % 5)
        },
        safety: {
          adverseEventsThisVisit: [],
          concomitantMedications: '',
          pregnancyStatus: 'NA'
        },
        missingRequiredFields: missing
      });
    }
  }
  return crfs;
};

export const ALL_CRFS: CRF[] = generateBulkCRFs();

// ─────────────────────────────────────────
// PRAKRITI ASSESSMENTS
// ─────────────────────────────────────────
export const PRAKRITI_ASSESSMENTS: PrakritiAssessment[] = PARTICIPANTS.map((p, i) => ({
  id: `pa-${p.id}`,
  participantId: p.id,
  trialId: 'trial-001',
  assessedAt: p.enrollmentDate + 'T10:00:00Z',
  vataScore: p.prakriti?.includes('Vata') ? 55 + (i % 20) : 20 + (i % 25),
  pittaScore: p.prakriti?.includes('Pitta') ? 45 + (i % 20) : 15 + (i % 25),
  kaphaScore: p.prakriti?.includes('Kapha') ? 40 + (i % 20) : 10 + (i % 20),
  dominantPrakriti: (p.dominantDosha || 'Vata') as 'Vata' | 'Pitta' | 'Kapha',
  answers: {}
}));

// ─────────────────────────────────────────
// DOSHA ASSESSMENTS (P-042 for demo narrative)
// ─────────────────────────────────────────
export const DOSHA_ASSESSMENTS: DoshaAssessment[] = [
  { id: 'da-042-1', participantId: 'P-042', visitId: 'v-042-1', trialId: 'trial-001', assessedAt: '2026-04-10T16:00:00Z', vataScore: 7, pittaScore: 4, kaphaScore: 2 },
  { id: 'da-042-2', participantId: 'P-042', visitId: 'v-042-2', trialId: 'trial-001', assessedAt: '2026-05-09T16:00:00Z', vataScore: 6, pittaScore: 5, kaphaScore: 2 },
  { id: 'da-042-3', participantId: 'P-042', visitId: 'v-042-3', trialId: 'trial-001', assessedAt: '2026-06-05T15:00:00Z', vataScore: 4, pittaScore: 4, kaphaScore: 2 },
];

// Generate aggregate dosha data for all participants (for research lens)
export const ALL_DOSHA_ASSESSMENTS: DoshaAssessment[] = [
  ...DOSHA_ASSESSMENTS,
  ...PARTICIPANTS.filter(p => p.id !== 'P-042').flatMap((p, i) => {
    const visits = Math.min(Math.floor(i / 10) + 1, 3);
    return Array.from({ length: visits }, (_, v) => ({
      id: `da-${p.id}-v${v+1}`,
      participantId: p.id,
      visitId: `v-${p.id}-${v+1}`,
      trialId: 'trial-001',
      assessedAt: `2026-0${3 + v}-15T10:00:00Z`,
      vataScore: 5 + (v === 0 ? 2 : v === 1 ? 1 : -1) + (i % 3) - 1,
      pittaScore: 3 + (i % 3) - 1,
      kaphaScore: 2 + (i % 2),
    }));
  })
];

// ─────────────────────────────────────────
// ADVERSE EVENTS
// ─────────────────────────────────────────
export const ADVERSE_EVENTS: AdverseEvent[] = [
  {
    id: 'ae-042-1',
    participantId: 'P-042',
    trialId: 'trial-001',
    reportedDate: '2026-05-09',
    eventName: 'Severe Allergic Reaction (Urticaria)',
    description: 'Participant developed widespread urticarial rash 3 days after switching antihypertensive from Amlodipine to Telmisartan. Reaction assessed as related to concomitant medication change, NOT to study drug.',
    severity: 'Severe',
    isSerious: true,
    isExpected: false,
    causality: 'Unrelated',
    actionTaken: 'Telmisartan withdrawn. Antihistamine administered. Dermatology consultation obtained.',
    outcome: 'Recovered without sequelae by Day 7',
    status: 'Under Review',
    reviewerNotes: 'Causality assessment confirms study drug not implicated. SAE form submitted to IEC.',
    resolvedDate: '2026-05-16',
    deadlineDays: 3,
    priority: 'Critical'
  },
  {
    id: 'ae-033-1',
    participantId: 'P-033',
    trialId: 'trial-001',
    reportedDate: '2026-07-12',
    eventName: 'Gastrointestinal Discomfort',
    description: 'Participant reported mild nausea and loose stools for 3 days. Possibly related to study drug at higher dose end of plasma concentration.',
    severity: 'Mild',
    isSerious: false,
    isExpected: true,
    causality: 'Possible',
    actionTaken: 'Dose taken with food, symptoms resolved within 5 days without intervention.',
    outcome: 'Resolved',
    status: 'Closed',
    reviewerNotes: 'Expected GI adverse event per protocol. No action required beyond dietary advice.',
    resolvedDate: '2026-07-17',
    deadlineDays: null,
    priority: 'Routine'
  },
  {
    id: 'ae-007-1',
    participantId: 'P-007',
    trialId: 'trial-001',
    reportedDate: '2026-06-20',
    eventName: 'Mild Headache',
    description: 'Intermittent mild headache reported over 2-week period. Participant attributes to stress (exam season).',
    severity: 'Mild',
    isSerious: false,
    isExpected: true,
    causality: 'Unlikely',
    actionTaken: 'Paracetamol PRN permitted. Diary maintained.',
    outcome: 'Resolved',
    status: 'Closed',
    reviewerNotes: 'Unlikely causality. Study continuation appropriate.',
    resolvedDate: '2026-07-04',
    deadlineDays: null,
    priority: 'Routine'
  },
  {
    id: 'ae-019-1',
    participantId: 'P-019',
    trialId: 'trial-001',
    reportedDate: '2026-08-01',
    eventName: 'Elevated Liver Enzymes (Grade 1)',
    description: 'ALT 52 U/L (ULN 40 U/L) at Week 8 visit. Participant asymptomatic. No clinical signs of hepatotoxicity. Repeat LFTs ordered.',
    severity: 'Mild',
    isSerious: true,  // Serious by protocol definition (abnormal lab requiring intervention)
    isExpected: false,
    causality: 'Possible',
    actionTaken: 'Study drug continued. Repeat LFTs in 2 weeks. Alcohol history taken.',
    outcome: 'Under investigation',
    status: 'Under Review',
    reviewerNotes: '',
    resolvedDate: null,
    deadlineDays: 7,
    priority: 'High'
  },
  {
    id: 'ae-055-1',
    participantId: 'P-055',
    trialId: 'trial-001',
    reportedDate: '2026-08-15',
    eventName: 'Insomnia — Worsening',
    description: 'Participant reported worsening of insomnia compared to baseline PSQI. Not expected as drug has sleep-promoting properties.',
    severity: 'Moderate',
    isSerious: false,
    isExpected: false,
    causality: 'Possible',
    actionTaken: 'Sleep hygiene counselling. Melatonin 3mg permitted. Protocol deviation noted.',
    outcome: 'Ongoing',
    status: 'Open',
    reviewerNotes: '',
    resolvedDate: null,
    deadlineDays: 14,
    priority: 'Review'
  },
  {
    id: 'ae-071-1',
    participantId: 'P-071',
    trialId: 'trial-001',
    reportedDate: '2026-08-22',
    eventName: 'Loose Stools',
    description: 'Grade 1 diarrhoea for 4 days. Expected adverse event for Triphala-containing formulations.',
    severity: 'Mild',
    isSerious: false,
    isExpected: true,
    causality: 'Probable',
    actionTaken: 'Oral hydration. Probiotic supplement added.',
    outcome: 'Resolved',
    status: 'Closed',
    reviewerNotes: 'Expected AE. Causality probable but clinically insignificant.',
    resolvedDate: '2026-08-26',
    deadlineDays: null,
    priority: 'Routine'
  },
];

// ─────────────────────────────────────────
// COMPLIANCE ITEMS
// ─────────────────────────────────────────
export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'ci-1', trialId: 'trial-001',
    requirement: 'Protocol Version Control', category: 'Protocol',
    status: 'Compliant', owner: 'Dr. Priya Sharma', dueDate: null,
    lastUpdated: '2026-02-12', notes: 'Protocol v2.1 approved and in use'
  },
  {
    id: 'ci-2', trialId: 'trial-001',
    requirement: 'Ethics Approval (IEC/AIIA/2026/001)', category: 'Ethics',
    status: 'Warning', owner: 'Dr. Anjali Rao', dueDate: '2026-09-23',
    lastUpdated: '2026-08-20', notes: 'Approval expires in 21 days — renewal in progress'
  },
  {
    id: 'ci-3', trialId: 'trial-001',
    requirement: 'Informed Consent — All Active Participants', category: 'Documentation',
    status: 'Compliant', owner: 'Rahul Mehta', dueDate: null,
    lastUpdated: '2026-08-28', notes: 'All 84 active participants have valid ICF on file'
  },
  {
    id: 'ci-4', trialId: 'trial-001',
    requirement: 'CTRI Registration', category: 'Regulatory',
    status: 'Compliant', owner: 'Dr. Priya Sharma', dueDate: null,
    lastUpdated: '2026-03-01', notes: 'CTRI/2026/03/AYU-001 registered'
  },
  {
    id: 'ci-5', trialId: 'trial-001',
    requirement: 'Required Documentation (GCP)', category: 'Documentation',
    status: 'Compliant', owner: 'Rahul Mehta', dueDate: null,
    lastUpdated: '2026-08-15', notes: 'Investigator Brochure, IMB, Laboratory manuals current'
  },
  {
    id: 'ci-6', trialId: 'trial-001',
    requirement: 'SAE Review (ae-042-1, ae-019-1)', category: 'Safety',
    status: 'Non-Compliant', owner: 'Vikram Singh', dueDate: '2026-09-05',
    lastUpdated: '2026-08-30', notes: '2 SAEs require PI sign-off within 7 days of report per protocol'
  },
  {
    id: 'ci-7', trialId: 'trial-001',
    requirement: 'Data Entry — All Completed Visits', category: 'Data',
    status: 'Warning', owner: 'Rahul Mehta', dueDate: '2026-09-10',
    lastUpdated: '2026-08-28', notes: '12 CRFs have missing required fields — data lock approaching'
  },
  {
    id: 'ci-8', trialId: 'trial-001',
    requirement: 'Audit Trail Integrity', category: 'Regulatory',
    status: 'Compliant', owner: 'System', dueDate: null,
    lastUpdated: '2026-09-02', notes: 'All audit events logged with timestamp and user context'
  },
];

// ─────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────
export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al-001', timestamp: '2026-09-02T14:42:00Z', userId: 'u1', userName: 'Dr. Priya Sharma', userRole: 'PI', action: 'Updated Trial Status', entityType: 'Trial', entityId: 'trial-001', details: 'Status changed from APPROVED → ACTIVE', trialId: 'trial-001' },
  { id: 'al-002', timestamp: '2026-09-02T14:31:00Z', userId: 'u2', userName: 'Rahul Mehta', userRole: 'Coordinator', action: 'Submitted CRF', entityType: 'CRF', entityId: 'crf-042-3', details: 'CRF for Visit 3 (P-042) submitted with 88% completion', trialId: 'trial-001' },
  { id: 'al-003', timestamp: '2026-09-02T13:50:00Z', userId: 'u4', userName: 'Vikram Singh', userRole: 'Safety', action: 'Reviewed SAE', entityType: 'AdverseEvent', entityId: 'ae-042-1', details: 'Initial review of SAE-042-1. Causality assessment: Unrelated to study drug. Full report pending.', trialId: 'trial-001' },
  { id: 'al-004', timestamp: '2026-09-01T18:20:00Z', userId: 'u1', userName: 'Dr. Priya Sharma', userRole: 'PI', action: 'Approved Protocol Amendment', entityType: 'Trial', entityId: 'trial-001', details: 'Protocol v2.1 amendment approved — updated SAE reporting timeline', trialId: 'trial-001' },
  { id: 'al-005', timestamp: '2026-09-01T16:45:00Z', userId: 'u2', userName: 'Rahul Mehta', userRole: 'Coordinator', action: 'Added Participant', entityType: 'Participant', entityId: 'P-084', details: 'New participant P-084 enrolled in Treatment arm', trialId: 'trial-001' },
  { id: 'al-006', timestamp: '2026-09-01T11:30:00Z', userId: 'u4', userName: 'Vikram Singh', userRole: 'Safety', action: 'Reported Adverse Event', entityType: 'AdverseEvent', entityId: 'ae-055-1', details: 'New AE reported: P-055 Insomnia worsening — Moderate severity', trialId: 'trial-001' },
  { id: 'al-007', timestamp: '2026-08-28T09:15:00Z', userId: 'u2', userName: 'Rahul Mehta', userRole: 'Coordinator', action: 'Completed Prakriti Assessment', entityType: 'PrakritiAssessment', entityId: 'pa-P-083', details: 'Prakriti assessment for P-083 completed — Dominant: Pitta (52%)', trialId: 'trial-001' },
  { id: 'al-008', timestamp: '2026-08-25T14:00:00Z', userId: 'u3', userName: 'Dr. Anjali Rao', userRole: 'Ethics', action: 'Submitted Renewal Notice', entityType: 'EthicsReview', entityId: 'eth-001', details: 'Ethics renewal application submitted to IEC. Expiry: 2026-09-23', trialId: 'trial-001' },
  { id: 'al-009', timestamp: '2026-08-22T10:30:00Z', userId: 'u2', userName: 'Rahul Mehta', userRole: 'Coordinator', action: 'Recorded Visit', entityType: 'Visit', entityId: 'v-042-3', details: 'Visit 3 completed for P-042. MMSE improved 23→26.', trialId: 'trial-001' },
  { id: 'al-010', timestamp: '2026-08-20T16:00:00Z', userId: 'u1', userName: 'Dr. Priya Sharma', userRole: 'PI', action: 'Reviewed Trial Health', entityType: 'Trial', entityId: 'trial-001', details: 'Monthly trial health review — score 82/100. Ethics renewal flagged.', trialId: 'trial-001' },
  { id: 'al-011', timestamp: '2026-08-15T11:00:00Z', userId: 'u4', userName: 'Vikram Singh', userRole: 'Safety', action: 'Reported Adverse Event', entityType: 'AdverseEvent', entityId: 'ae-071-1', details: 'AE reported for P-071 — Grade 1 GI symptoms, probable causality', trialId: 'trial-001' },
  { id: 'al-012', timestamp: '2026-08-01T09:45:00Z', userId: 'u2', userName: 'Rahul Mehta', userRole: 'Coordinator', action: 'Reported Adverse Event', entityType: 'AdverseEvent', entityId: 'ae-019-1', details: 'SAE reported: P-019 elevated LFTs. Study drug continuation decision pending.', trialId: 'trial-001' },
  { id: 'al-013', timestamp: '2026-07-28T15:30:00Z', userId: 'u1', userName: 'Dr. Priya Sharma', userRole: 'PI', action: 'Generated FHIR Bundle', entityType: 'Trial', entityId: 'trial-001', details: 'FHIR R4 Bundle generated for interim data snapshot.', trialId: 'trial-001' },
  { id: 'al-014', timestamp: '2026-02-12T10:00:00Z', userId: 'u3', userName: 'Dr. Anjali Rao', userRole: 'Ethics', action: 'Approved Trial Ethics', entityType: 'EthicsReview', entityId: 'eth-001', details: 'Ethics approval granted — IEC/AIIA/2026/001. Validity: 12 months.', trialId: 'trial-001' },
  { id: 'al-015', timestamp: '2026-01-15T09:00:00Z', userId: 'u1', userName: 'Dr. Priya Sharma', userRole: 'PI', action: 'Created Trial', entityType: 'Trial', entityId: 'trial-001', details: 'Trial AYU-001 created in DRAFT status.', trialId: 'trial-001' },
];

// ─────────────────────────────────────────
// PRE-COMPUTED ALERTS (from intelligence engine)
// ─────────────────────────────────────────
export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alert-1', trialId: 'trial-001', type: 'SAE_REVIEW', priority: 'Critical',
    title: '2 SAE reviews pending',
    description: 'Two serious adverse events (ae-042-1, ae-019-1) require PI sign-off within 3–7 days per protocol.',
    count: 2, entityType: 'AdverseEvent',
    entityIds: ['ae-042-1', 'ae-019-1'],
    navigateTo: '/trials/trial-001/safety',
    createdAt: '2026-09-02T14:00:00Z', isResolved: false
  },
  {
    id: 'alert-2', trialId: 'trial-001', type: 'ETHICS_RENEWAL', priority: 'High',
    title: 'Ethics approval expires in 21 days',
    description: 'IEC/AIIA/2026/001 expires 2026-09-23. Trial AYU-001 has 84 active participants. Renewal submission must be completed immediately.',
    count: 1, entityType: 'EthicsReview',
    entityIds: ['eth-001'],
    navigateTo: '/trials/trial-001/ethics',
    createdAt: '2026-09-02T06:00:00Z', isResolved: false
  },
  {
    id: 'alert-3', trialId: 'trial-001', type: 'OVERDUE_VISIT', priority: 'High',
    title: '7 participants have overdue visits',
    description: 'Participants P-003, P-008, P-015, P-022, P-031, P-044, P-058 have missed their scheduled visits by more than 7 days.',
    count: 7, entityType: 'Visit',
    entityIds: ['P-003','P-008','P-015','P-022','P-031','P-044','P-058'],
    navigateTo: '/trials/trial-001/visits',
    createdAt: '2026-09-02T06:00:00Z', isResolved: false
  },
  {
    id: 'alert-4', trialId: 'trial-001', type: 'MISSING_CRF', priority: 'Medium',
    title: '12 CRFs have missing required fields',
    description: 'Data lock approaching (Sep 10). CRFs for P-003, P-007, P-011, P-018, P-023, P-029, P-034, P-041, P-051, P-062, P-070, P-079 have incomplete required data.',
    count: 12, entityType: 'CRF',
    entityIds: [],
    navigateTo: '/trials/trial-001/participants',
    createdAt: '2026-09-02T06:00:00Z', isResolved: false
  },
];

// ─────────────────────────────────────────
// VISITS (bulk for overdue display)
// ─────────────────────────────────────────
export const OVERDUE_PARTICIPANT_IDS = ['P-003','P-008','P-015','P-022','P-031','P-044','P-058'];

export const generateAllVisits = (): Visit[] => {
  const visits: Visit[] = [...VISITS_P042];
  PARTICIPANTS.forEach((p) => {
    if (p.id === 'P-042') return;
    const isOverdue = OVERDUE_PARTICIPANT_IDS.includes(p.id);
    const totalV = p.lastVisitNumber;
    for (let v = 1; v <= 4; v++) {
      const isCompleted = v < totalV;
      const isCurrent = v === totalV;
      visits.push({
        id: `v-${p.id}-${v}`,
        participantId: p.id,
        trialId: 'trial-001',
        visitNumber: v,
        visitName: ['Screening / Baseline', 'Week 4', 'Week 8', 'Week 12 (Final)'][v - 1],
        scheduledDate: `2026-0${3 + v}-15`,
        actualDate: isCompleted ? `2026-0${3 + v}-16` : null,
        status: isCompleted ? 'Completed' : isCurrent && isOverdue ? 'Overdue' : isCurrent ? 'Due' : 'Upcoming',
        crfId: isCompleted ? `crf-${p.id}-v${v}` : null,
        doshaAssessmentId: isCompleted ? `da-${p.id}-v${v}` : null,
        notes: ''
      });
    }
  });
  return visits;
};

export const ALL_VISITS: Visit[] = generateAllVisits();
