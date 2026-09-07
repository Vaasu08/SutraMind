import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  BrainCircuit,
  Share2,
  FileCheck2,
} from 'lucide-react';

interface ProgressPageProps {
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onLaunchApp, lang }) => {
  const [activePhase, setActivePhase] = useState<'phase1' | 'phase2' | 'phase3' | 'phase4'>('phase1');

  const t = {
    en: {
      badge: 'Transparent Engineering Roadmap',
      title: 'SutraMind Development Progress & Phased Roadmap',
      subtitle:
        'Track our engineering journey from the verified Phase 1 MVP to offline field synchronization, global CDISC/FHIR interoperability, and AI intelligence.',
      tabLabels: {
        phase1: 'Phase 1: Core CTMS (Completed)',
        phase2: 'Phase 2: Field & Safety',
        phase3: 'Phase 3: Interoperability',
        phase4: 'Phase 4: AI Intelligence',
      },
      phases: {
        phase1: {
          tag: '100% COMPLETE & VERIFIED',
          tagClass: 'completed',
          title: 'Phase 1 — Core Ayurveda CTMS (Current Deliverable)',
          desc: 'Delivers the complete online clinical trial workflow with zero mock buttons on success paths. Fully validated by a 12-test automated integration suite.',
          highlights: [
            {
              title: 'Multi-Role JWT Authentication & RBAC',
              desc: 'Enforces strict permission gating across 6 clinical roles: PI, Coordinator, Monitor, Ethics, Admin, and PV.',
            },
            {
              title: 'Study & Protocol Setup with Anupana',
              desc: 'Configures Vyadhi diagnosis, classical ASU&H intervention lookup, dosage form, and Anupana carrier vehicle.',
            },
            {
              title: 'Structured 5-Point Ayurveda Baseline',
              desc: 'Relational capture of Prakriti (P1-P7), Agni (A1-A4), Bala (B1-B3), Satva (S1-S3), and Vikriti doshic morbidity.',
            },
            {
              title: 'Sequential Visit Scheduling & eCRF Capture',
              desc: 'Captures vital signs, interval symptom changes, and drug compliance, freezing into read-only records upon completion.',
            },
            {
              title: 'Full Discrepancy Query Resolution Cycle',
              desc: '3-tier workflow: Monitor discrepancy query (OPEN) → Coordinator evidence response (ANSWERED) → PI review and closure (CLOSED).',
            },
            {
              title: 'Independent IEC Ethics Review Management',
              desc: 'IEC approval number, validity dates, and renewal decisions managed while blinding ethics reviewers to participant health data.',
            },
            {
              title: 'Controlled Master Dictionary Governance',
              desc: 'Admin panel allows activating/deactivating Ayurvedic terminology and adding new classical terms without breaking past records.',
            },
            {
              title: 'Bilingual English / Hindi Localization',
              desc: 'Real-time language toggle throughout all screens, labels, and forms without modifying canonical database storage.',
            },
          ],
          tests: [
            'test_login_success_all_roles (PASSED)',
            'test_login_invalid_password & unknown_user (PASSED)',
            'test_coordinator_forbidden_to_create_study (PASSED)',
            'test_monitor_forbidden_to_edit_crf (PASSED)',
            'test_ethics_forbidden_to_read_participants (PASSED)',
            'test_pi_create_study_and_protocol (PASSED)',
            'test_coordinator_enroll_participant_with_baseline (PASSED)',
            'test_visit_and_crf_lifecycle (PASSED)',
            'test_data_query_workflow (PASSED)',
            'test_ethics_decision_update (PASSED)',
            'test_dashboard_kpis_calculation (PASSED)',
          ],
        },
        phase2: {
          tag: 'NEXT MILESTONE (Q4 2026)',
          tagClass: 'in-progress',
          title: 'Phase 2 — Field Operations, Audit Trail & Safety',
          desc: 'Extends Phase 1 with durable historical audit trails, offline field-trial synchronization, classical Panchakarma management, and pharmacovigilance safety cases.',
          highlights: [
            {
              title: '21 CFR Part 11 Cryptographic Audit Trail',
              desc: 'Append-only event store capturing actor UUID, timestamp, entity affected, old/new field values, and reason for change with SHA-256 integrity hashes.',
            },
            {
              title: 'Offline Windows/Tablet Client & SQLite Sync',
              desc: 'Dedicated desktop client with an explicit conflict-resolution queue for remote rural medical camps and multi-center sites with intermittent internet.',
            },
            {
              title: 'Adverse Events & Pharmacovigilance (AE/SAE)',
              desc: 'Complete safety case workflow with seriousness grading, causality assessment, medical review, and expedited ICSR reporting.',
            },
            {
              title: 'Classical Panchakarma Procedure Tracking',
              desc: 'Multi-day procedural module tracking Purvakarma (Snehana, Swedana), Pradhanakarma (Vamana, Virechana, Basti, Nasya, Raktamokshana), and Paschatkarma diets.',
            },
          ],
          tests: [],
        },
        phase3: {
          tag: 'PLANNED (2027)',
          tagClass: 'planned',
          title: 'Phase 3 — Interoperability, CDISC & Global Standards',
          desc: 'Enables global clinical submissions and hospital EHR interoperability by transforming structured Ayurvedic trial data into international healthcare standards.',
          highlights: [
            {
              title: 'CDISC SDTM / ODM-XML Regulatory Export',
              desc: 'Automated extraction of trial demographics (DM), vital signs (VS), and interventions (CM) into standardized CDISC datasets for regulatory filing.',
            },
            {
              title: 'HL7 FHIR R4 Clinical Resources',
              desc: 'Validated mapping from study observations to standard FHIR ResearchStudy, ResearchSubject, and Observation resources.',
            },
            {
              title: 'MedDRA v27+ Automated Coding',
              desc: 'Coding of adverse events and symptoms to international medical terminology while preserving the original Ayurvedic formulation context.',
            },
            {
              title: 'WHODrug Global Product Registry Linkage',
              desc: 'Connecting registered ASU&H commercial and classical formulations with global medicinal product identifiers.',
            },
          ],
          tests: [],
        },
        phase4: {
          tag: 'FUTURE VISION (2027+)',
          tagClass: 'planned',
          title: 'Phase 4 — AI Intelligence & Adaptive Clinical Optimization',
          desc: 'Leverages governed, high-integrity Ayurvedic clinical data to power predictive trial analytics, doshic contraindication alerts, and adaptive trial design.',
          highlights: [
            {
              title: 'Prakriti-Response Correlation Engine',
              desc: 'Machine learning models analyzing multi-centric trial cohorts to discover statistical correlations between baseline Prakriti and treatment efficacy.',
            },
            {
              title: 'Doshic Contraindication Early Warning',
              desc: 'Automated safety alerts flagging potential conflicts between a participant’s Prakriti/Vikriti and prescribed trial herbs or dietetic regimens.',
            },
            {
              title: 'Adaptive Trial Cohort Stratification',
              desc: 'Algorithmic assistance for investigators to optimize sample size and stratify participant enrollment based on real-time response rates.',
            },
            {
              title: 'Non-Autonomous Decision Support',
              desc: 'Strictly explainable clinical intelligence that assists investigators without replacing Principal Investigator authority.',
            },
          ],
          tests: [],
        },
      },
      rulesTitle: 'Architectural Guardrails Across All Phases',
      rulesDesc: 'Engineering principles maintained across the SutraMind roadmap.',
      rules: [
        'Stable UUIDs and controlled term codes carry forward permanently, ensuring historical clinical data remains immutable.',
        'Audit logs reside in append-only tables that are architecturally decoupled from operational CRUD endpoints.',
        'Terminology dictionaries are versioned as authoritative assets, preventing ad-hoc free-text corruption.',
        'AI models provide explainable decision support only; PI sign-off is mandatory for all clinical decisions.',
      ],
    },
    hi: {
      badge: 'पारदर्शी इंजीनियरिंग रोडमैप',
      title: 'सूत्रमाइंड विकास प्रगति एवं चरणबद्ध रोडमैप',
      subtitle:
        'सत्यापित फेज 1 एमवीपी से लेकर ऑफलाइन फील्ड सिंक्रनाइज़ेशन, वैश्विक सीडीआईएससी/एफएचआईआर इंटरऑपरेबिलिटी और एआई बुद्धिमत्ता तक हमारी यात्रा।',
      tabLabels: {
        phase1: 'फेज 1: कोर सीटीएमएस (पूर्ण)',
        phase2: 'फेज 2: फील्ड एवं सुरक्षा',
        phase3: 'फेज 3: वैश्विक मानक',
        phase4: 'फेज 4: एआई विश्लेषण',
      },
      phases: {
        phase1: {
          tag: '100% पूर्ण एवं सत्यापित',
          tagClass: 'completed',
          title: 'फेज 1 — कोर आयुर्वेद सीटीएमएस (वर्तमान उत्पाद)',
          desc: 'सफलता पथ पर बिना किसी मॉक बटन के पूर्ण ऑनलाइन क्लिनिकल ट्रायल वर्कफ़्लो प्रदान करता है। 12 स्वचालित परीक्षणों द्वारा पूरी तरह सत्यापित।',
          highlights: [
            {
              title: 'बहु-भूमिका JWT प्रमाणीकरण एवं RBAC',
              desc: '6 नैदानिक भूमिकाओं (PI, समन्वयक, मॉनिटर, आचार, एडमिन, PV) में सख्त एक्सेस नियंत्रण।',
            },
            {
              title: 'अनुपान के साथ प्रोटोकॉल विन्यास',
              desc: 'व्याधि निदान, शास्त्रीय औषधि, खुराक रूप और अनुपान का संरचित चयन।',
            },
            {
              title: 'संरचित 5-बिंदु आयुर्वेद बेसलाइन',
              desc: 'प्रकृति (P1-P7), जठराग्नि (A1-A4), बल (B1-B3), सत्व (S1-S3) और विकृति का रिलेशनल रिकॉर्ड।',
            },
            {
              title: 'चरणबद्ध विज़िट शेड्यूलिंग और सीआरएफ लॉकिंग',
              desc: 'वाइटल्स, लक्षण सुधार और दवा अनुपालन दर्ज करता है; पूर्ण होने पर केवल-पठनीय बन जाता है।',
            },
            {
              title: 'सम्पूर्ण क्वेरी समाधान चक्र',
              desc: 'मॉनिटर विसंगति प्रश्न (OPEN) → समन्वयक साक्ष्य उत्तर (ANSWERED) → पीआई सत्यापन और समापन (CLOSED)।',
            },
            {
              title: 'स्वतंत्र आचार समिति (IEC) प्रबंधन',
              desc: 'रोगी की पहचान छिपाते हुए आईईसी अनुमोदन संख्या और वैधता तिथियों का प्रबंधन।',
            },
            {
              title: 'नियंत्रित मास्टर डिक्शनरी प्रशासन',
              desc: 'पुराने रिकॉर्ड को तोड़े बिना नई आयुर्वेदिक शब्दावली जोड़ना और सक्रिय/निष्क्रिय करना।',
            },
            {
              title: 'द्विभाषी अंग्रेजी / हिन्दी इंटरफ़ेस',
              desc: 'डेटाबेस कोड बदले बिना पूरे सिस्टम में अंग्रेजी और हिन्दी के बीच रीयल-टाइम स्विचिंग।',
            },
          ],
          tests: [
            'test_login_success_all_roles (सफल)',
            'test_login_invalid_password (सफल)',
            'test_coordinator_forbidden_to_create_study (सफल)',
            'test_monitor_forbidden_to_edit_crf (सफल)',
            'test_ethics_forbidden_to_read_participants (सफल)',
            'test_pi_create_study_and_protocol (सफल)',
            'test_coordinator_enroll_participant_with_baseline (सफल)',
            'test_visit_and_crf_lifecycle (सफल)',
            'test_data_query_workflow (सफल)',
            'test_ethics_decision_update (सफल)',
            'test_dashboard_kpis_calculation (सफल)',
          ],
        },
        phase2: {
          tag: 'अगला मील का पत्थर (Q4 2026)',
          tagClass: 'in-progress',
          title: 'फेज 2 — फील्ड संचालन, ऑडिट ट्रेल एवं सुरक्षा',
          desc: 'फेज 1 का विस्तार अपरिवर्तनीय ऑडिट ट्रेल, ऑफलाइन फील्ड सिंक्रनाइज़ेशन, पंचकर्म मॉड्यूल और फार्माकोविजिलेंस के साथ।',
          highlights: [
            {
              title: '21 सीएफआर पार्ट 11 क्रिप्टोग्राफिक ऑडिट ट्रेल',
              desc: 'प्रत्येक डेटा परिवर्तन के लिए SHA-256 हैश, उपयोगकर्ता, समय और कारण के साथ अपरिवर्तनीय लॉग।',
            },
            {
              title: 'ऑफलाइन क्लाइंट एवं SQLite सिंक',
              desc: 'दूरदराज के ग्रामीण शिविरों और कमजोर इंटरनेट वाले केंद्रों के लिए ऑफलाइन डेस्कटॉप/टैबलेट सिंक।',
            },
            {
              title: 'प्रतिकूल घटनाएं एवं फार्माकोविजिलेंस (AE/SAE)',
              desc: 'गंभीरता ग्रेडिंग, कार्य-कारण संबंध और त्वरित ICSR रिपोर्टिंग के साथ संपूर्ण सुरक्षा वर्कफ़्लो।',
            },
            {
              title: 'शास्त्रीय पंचकर्म प्रक्रिया ट्रैकिंग',
              desc: 'पूर्वकम (स्नेहन, स्वेदन), प्रधानकर्म (वमन, विरेचन, बस्ति, नस्य, रक्तमोक्षण) और पश्चात्कर्म की निगरानी।',
            },
          ],
          tests: [],
        },
        phase3: {
          tag: 'नियोजित (2027)',
          tagClass: 'planned',
          title: 'फेज 3 — वैश्विक मानक, सीडीआईएससी एवं इंटरऑपरेबिलिटी',
          desc: 'आयुर्वेदिक परीक्षण डेटा को अंतरराष्ट्रीय स्वास्थ्य मानकों में बदलकर वैश्विक नियामक सबमिशन को सक्षम बनाना।',
          highlights: [
            {
              title: 'CDISC SDTM / ODM-XML नियामक निर्यात',
              desc: 'सीडीएससीओ और अंतरराष्ट्रीय नियामकों के लिए मानकीकृत सीडीआईएससी डेटासेट में स्वचालित निष्कर्षण।',
            },
            {
              title: 'HL7 FHIR R4 नैदानिक संसाधन',
              desc: 'अस्पताल ईएचआर प्रणालियों के साथ इंटरऑपरेबिलिटी हेतु एफएचआईआर मैपिंग।',
            },
            {
              title: 'MedDRA v27+ स्वचालित कोडिंग',
              desc: 'आयुर्वेदिक संदर्भ को संरक्षित रखते हुए अंतरराष्ट्रीय शब्दावली में लक्षणों की कोडिंग।',
            },
            {
              title: 'WHODrug वैश्विक औषधि रजिस्ट्री लिंकेज',
              desc: 'शास्त्रीय औषधियों को वैश्विक औषधीय उत्पाद पहचानकर्ताओं से जोड़ना।',
            },
          ],
          tests: [],
        },
        phase4: {
          tag: 'भविष्य की दृष्टि (2027+)',
          tagClass: 'planned',
          title: 'फेज 4 — एआई बुद्धिमत्ता एवं अनुकूली परीक्षण',
          desc: 'अनुमानात्मक परीक्षण विश्लेषण और दोषीय प्रतिकूलता चेतावनियों के लिए उच्च-अखंडता डेटा का उपयोग।',
          highlights: [
            {
              title: 'प्रकृति-परिणाम सह-संबंध इंजन',
              desc: 'प्रतिभागी प्रकृति और उपचार प्रभावकारिता के बीच सांख्यिकीय सह-संबंध खोजने के लिए मशीन लर्निंग।',
            },
            {
              title: 'दोषीय प्रतिकूलता प्रारंभिक चेतावनी',
              desc: 'रोगी की प्रकृति और परीक्षण औषधियों के बीच संभावित संघर्ष पर स्वचालित सुरक्षा अलर्ट।',
            },
            {
              title: 'अनुकूली परीक्षण कोहोर्ट स्तरीकरण',
              desc: 'वास्तविक समय प्रतिक्रिया दरों के आधार पर नमूना आकार और भर्ती को अनुकूलित करना।',
            },
            {
              title: 'गैर-स्वायत्त निर्णय सहायता',
              desc: 'पारदर्शी एआई जो केवल मुख्य अन्वेषक (PI) की सहायता करती है, निर्णय नहीं लेती।',
            },
          ],
          tests: [],
        },
      },
      rulesTitle: 'सभी चरणों में वास्तुशिल्प सुरक्षा उपाय',
      rulesDesc: 'सूत्रमाइंड रोडमैप में बनाए रखे गए इंजीनियरिंग सिद्धांत।',
      rules: [
        'स्थिर UUIDs और नियंत्रित कोड स्थायी रूप से बने रहते हैं, जिससे पुराना क्लिनिकल डेटा कभी दूषित नहीं होता।',
        'ऑडिट लॉग केवल-जोड़े जाने वाली तालिकाओं में रहते हैं जो सामान्य CRUD मार्गों से अलग हैं।',
        'शब्दावली को आधिकारिक परिसंपत्तियों के रूप में संस्करणबद्ध किया जाता है, जिससे फ्री-टेक्स्ट विकृति रुकती है।',
        'एआई मॉडल केवल निर्णय सहायता प्रदान करते हैं; अंतिम हस्ताक्षर हमेशा मुख्य अन्वेषक (PI) का होता है।',
      ],
    },
  }[lang];

  const current = t.phases[activePhase];

  return (
    <div className="saas-animate-fade" style={{ padding: '48px 0 80px' }}>
      <div className="saas-container">
        {/* Header */}
        <div className="saas-section-header" style={{ marginBottom: '40px' }}>
          <div className="saas-pill">
            <span className="saas-pill-dot" />
            <span>{t.badge}</span>
          </div>
          <h1 className="saas-section-title" style={{ marginTop: '16px' }}>{t.title}</h1>
          <p className="saas-section-desc">{t.subtitle}</p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="saas-tabs-header" style={{ marginBottom: '40px' }}>
          {(['phase1', 'phase2', 'phase3', 'phase4'] as const).map((pKey) => (
            <button
              key={pKey}
              className={`saas-tab-btn ${activePhase === pKey ? 'active' : ''}`}
              onClick={() => setActivePhase(pKey)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {pKey === 'phase1' && <CheckCircle2 size={16} />}
              {pKey === 'phase2' && <Clock size={16} />}
              {pKey === 'phase3' && <Share2 size={16} />}
              {pKey === 'phase4' && <BrainCircuit size={16} />}
              <span>{t.tabLabels[pKey]}</span>
            </button>
          ))}
        </div>

        {/* Main Phase Detail Card */}
        <div className="saas-card saas-animate-fade" key={activePhase} style={{ padding: '40px', marginBottom: '48px' }}>
          <div className="saas-phase-header">
            <div>
              <span className={`saas-status-badge ${current.tagClass}`}>● {current.tag}</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 850, color: 'var(--saas-primary-dark)', marginTop: '8px' }}>
                {current.title}
              </h2>
            </div>

            {activePhase === 'phase1' && (
              <button className="saas-btn-gold" onClick={onLaunchApp} style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                <span>Test Live Prototype</span>
              </button>
            )}
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--saas-text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
            {current.desc}
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--saas-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Core Capabilities & Module Architecture:
          </h3>

          <div className="saas-grid-2" style={{ marginBottom: '32px' }}>
            {current.highlights.map((h, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--saas-surface-muted)',
                  padding: '20px',
                  borderRadius: 'var(--saas-radius-md)',
                  border: '1px solid var(--saas-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div className="saas-check-icon green">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 750, color: 'var(--saas-primary-dark)', marginBottom: '6px' }}>
                      {h.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--saas-text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {h.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Test Suite verification for Phase 1 */}
          {activePhase === 'phase1' && (
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 'var(--saas-radius-md)', border: '1px solid #e2e8f0', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f5953', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck2 size={18} />
                  <span>Automated Integration Test Verification (12 / 12 Passing):</span>
                </span>
                <span className="saas-status-badge completed">pytest: 100% Green</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {current.tests.map((tName, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#166534', background: '#dcfce7', padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>✓</span>
                    <span>{tName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Architectural Guardrails */}
        <div className="saas-card" style={{ padding: '36px', background: 'linear-gradient(135deg, rgba(15, 89, 83, 0.04), rgba(197, 155, 39, 0.04))' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--saas-primary-dark)', marginBottom: '8px' }}>
            {t.rulesTitle}
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--saas-text-muted)', marginBottom: '20px' }}>
            {t.rulesDesc}
          </p>

          <ul className="saas-checklist">
            {t.rules.map((rule, idx) => (
              <li key={idx} className="saas-checklist-item">
                <div className="saas-check-icon blue">
                  <CheckCircle2 size={14} />
                </div>
                <span style={{ fontSize: '0.92rem', color: 'var(--saas-text)' }}>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
