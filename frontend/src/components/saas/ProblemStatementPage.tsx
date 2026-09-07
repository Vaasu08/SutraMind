import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

interface ProblemStatementPageProps {
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
}

export const ProblemStatementPage: React.FC<ProblemStatementPageProps> = ({ onLaunchApp, lang }) => {
  const t = {
    en: {
      badge: 'Official Challenge Breakdown • SIH 2026',
      title: 'Problem Statement & Requirements Analysis',
      subtitle:
        'Why conventional clinical trial platforms fail for traditional medicine, and how SutraMind delivers an Ayurveda-native, globally compliant CTMS solution.',
      crisisTitle: 'The Fundamental Problem: The "Free-Text Trap"',
      crisisDesc:
        'Generic Western CTMS systems (Medidata Rave, Oracle InForm, Veeva Vault) are built exclusively around allopathic biomarkers. When Ayurvedic trials attempt to use these platforms, profound systemic failures occur:',
      crisisPoints: [
        {
          title: 'Loss of Ayurvedic Clinical Nuance',
          desc: 'Parameters like Prakriti (constitution), Agni (digestive fire), Bala (vitality), and Satva (mental strength) have no schema definitions. Investigators are forced to cram them into free-text comment boxes.',
        },
        {
          title: 'Statistical & Scientific Invalidation',
          desc: 'Free-text observations cannot be queried, cross-tabulated, or statistically correlated with drug efficacy across multi-center trial cohorts, undermining international scientific acceptance.',
        },
        {
          title: 'Paper Records & Audit Vulnerability',
          desc: 'Due to Western software friction, many Indian Ayurvedic trials still rely on paper CRFs or unvalidated spreadsheets, risking regulatory rejection under AYUSH GCP and Schedule Y.',
        },
      ],
      reqsTitle: '8 Core Problem Statement Requirements & SutraMind Solutions',
      reqsDesc: 'How every clause of the Ministry of Ayush CTMS requirement is solved natively in SutraMind.',
      reqs: [
        {
          num: '1',
          title: 'Standardized Ayurveda Data Capture',
          prob: 'Traditional concepts (7 Prakriti, 4 Agni, 3 Bala, 3 Satva, Vyadhi, Anupana) lack standardized fields.',
          sol: 'SutraMind creates controlled relational master dictionaries for all core Ayurvedic concepts, ensuring 100% structured data capture with zero reliance on unstructured text.',
        },
        {
          num: '2',
          title: 'Bilingual Clinical Operation',
          prob: 'Tier-2 and tier-3 Ayurvedic research hospitals operate predominantly in Hindi; English-only interfaces cause high data error rates.',
          sol: 'Real-time toggle between English and Hindi across the entire user interface, data labels, and validation states without altering canonical database codes.',
        },
        {
          num: '3',
          title: 'Independent Ethics Committee (IEC) Oversight',
          prob: 'Ethics approval states and validity dates must be verifiable without compromising participant privacy.',
          sol: 'Dedicated Ethics Committee workspace allowing IEC renewal and decision logging while cryptographically and structurally barring ethics users from accessing participant health data.',
        },
        {
          num: '4',
          title: 'Strict Multi-Role Access Control (RBAC)',
          prob: 'Lack of segregation of duties leads to conflicting investigator data entry and biased monitoring.',
          sol: '6 distinct roles (PI, Coordinator, Monitor, Ethics, Admin, PV). Coordinators enter data; Monitors review and query; PIs arbitrate and govern; Admins maintain master data.',
        },
        {
          num: '5',
          title: 'Electronic Case Report Forms (eCRF) & Data Freeze',
          prob: 'Paper CRFs or spreadsheets allow retroactive data tampering and post-hoc data alteration.',
          sol: 'Digital CRFs capture interval vitals, symptoms, and drug adherence, transitioning from DRAFT to COMPLETED. Completed forms are locked as read-only.',
        },
        {
          num: '6',
          title: 'Source Data Verification (SDV) & Query Workflow',
          prob: 'Data discrepancies between hospital case records and CTMS entries go unresolved without audit trails.',
          sol: 'Complete 3-tier query lifecycle: Monitor raises field-specific query (OPEN) → Coordinator provides source verification (ANSWERED) → PI reviews and closes (CLOSED).',
        },
        {
          num: '7',
          title: 'ASU&H Intervention & Pharmacovigilance Readiness',
          prob: 'Ayurvedic formulations require dosage form, Anupana (carrier vehicle), and batch duration tracking.',
          sol: 'Protocol model links classical ASU&H formulations (Vati, Churna, Asava, Taila) with specific Anupana (e.g. Koshna Jala, Madhu) to track adherence and prepare for Phase 2 AE/SAE reporting.',
        },
        {
          num: '8',
          title: 'Global Regulatory & CDISC Interoperability',
          prob: 'National trials cannot currently be submitted to international regulators due to non-standard exports.',
          sol: 'Architecture built on UUIDs, normalized database schemas, and controlled term codes ready for CDISC SDTM and HL7 FHIR R4 dataset transformations in Phase 3.',
        },
      ],
      matrixTitle: 'Feature Comparison Matrix',
      matrixDesc: 'Benchmarking traditional paper trials, generic Western CTMS, and SutraMind Ayurveda CTMS.',
      matrixCols: ['Clinical Dimension', 'Paper / Spreadsheets', 'Western CTMS (Veeva/Medidata)', 'SutraMind Ayurveda CTMS'],
      matrixRows: [
        {
          param: 'Prakriti, Agni, Bala, Satva Capture',
          paper: 'Handwritten / Uncontrolled',
          generic: 'Unstructured text notes only',
          sutramind: 'Structured relational master terms (P1-P7, A1-A4, B1-B3)',
        },
        {
          param: 'Anupana (Carrier Vehicle) Tracking',
          paper: 'Inconsistent doctor notes',
          generic: 'Unsupported',
          sutramind: 'Standardized protocol field (AN01-AN08)',
        },
        {
          param: 'Language Support',
          paper: 'Mixed Hindi / English',
          generic: 'English only',
          sutramind: 'Instant bilingual English & Hindi toggle',
        },
        {
          param: 'Role Segregation (PI vs CRC vs CRA)',
          paper: 'None (everyone writes)',
          generic: 'Complex allopathic roles',
          sutramind: '6 tailored Ayurvedic clinical trial roles',
        },
        {
          param: 'CRF Locking & Immutability',
          paper: 'Easily altered retroactively',
          generic: 'Requires complex licensing',
          sutramind: 'Native DRAFT to COMPLETED read-only freeze',
        },
        {
          param: 'Ethics Review Independence',
          paper: 'Physical paper binder',
          generic: 'Separate costly addon',
          sutramind: 'Dedicated IEC workspace with patient data blinding',
        },
        {
          param: 'Total Cost of Ownership',
          paper: 'Low upfront, catastrophic errors',
          generic: '$100k+ per trial licensing',
          sutramind: 'Open standard, accessible to Ayush institutes',
        },
      ],
      standardsTitle: 'Regulatory Standards Alignment',
      standardsDesc: 'SutraMind is designed to comply with Indian and international clinical research frameworks.',
      standards: [
        { name: 'AYUSH GCP Guidelines', org: 'Ministry of Ayush', desc: 'Complies with Good Clinical Practice guidelines for clinical trials in Ayurveda, Siddha, and Unani.' },
        { name: 'Schedule Y / NDCTR 2019', org: 'CDSCO India', desc: 'Adheres to New Drugs and Clinical Trials Rules for multi-centric clinical trial ethics and safety reporting.' },
        { name: 'US FDA 21 CFR Part 11', org: 'US Food & Drug Admin', desc: 'Architected with read-only form freezes, role segregation, and immutable audit trail foundations.' },
        { name: 'ICMR Bioethics Code', org: 'Indian Council of Medical Research', desc: 'Enforces participant confidentiality by blinding ethics reviewers to personal patient identifiers.' },
      ],
    },
    hi: {
      badge: 'आधिकारिक समस्या विवरण • एसआईएच 2026',
      title: 'समस्या विवरण एवं आवश्यकताओं का गहन विश्लेषण',
      subtitle:
        'पारंपरिक चिकित्सा के लिए पारंपरिक क्लिनिकल ट्रायल प्लेटफॉर्म क्यों विफल होते हैं, और सूत्रमाइंड कैसे आयुर्वेद-अनुकूल, वैश्विक स्तर पर अनुपालक सीटीएमएस प्रदान करता है।',
      crisisTitle: 'मूल संकट: "अनस्ट्रक्चर्ड टेक्स्ट बॉक्स ट्रैप"',
      crisisDesc:
        'जेनेरिक पश्चिमी सीटीएमएस सिस्टम (मेडिडाटा, ओरेकल, वीवा) केवल एलोपैथिक बायोमार्कर्स के इर्द-गिर्द बने हैं। जब आयुर्वेदिक ट्रायल इन प्लेटफॉर्म्स का उपयोग करने का प्रयास करते हैं, तो गंभीर विफलताएं होती हैं:',
      crisisPoints: [
        {
          title: 'आयुर्वेदिक नैदानिक सूक्ष्मता की हानि',
          desc: 'प्रकृति, जठराग्नि, शारीरिक बल और मानसिक सत्व जैसे पैरामीटर्स के लिए कोई संरचित डेटा फ़ील्ड नहीं होते। शोधकर्ताओं को उन्हें अनस्ट्रक्चर्ड कमेंट बॉक्स में लिखना पड़ता है।',
        },
        {
          title: 'सांख्यिकीय एवं वैज्ञानिक अस्वीकार्यता',
          desc: 'अनस्ट्रक्चर्ड टेक्स्ट का बहु-केंद्र परीक्षणों में सांख्यिकीय विश्लेषण या दवा प्रभावशीलता के साथ सह-संबंध नहीं निकाला जा सकता, जिससे अंतरराष्ट्रीय मान्यता प्रभावित होती है।',
        },
        {
          title: 'कागजी रिकॉर्ड और ऑडिट जोखिम',
          desc: 'पश्चिमी सॉफ्टवेयर की जटिलता के कारण, कई भारतीय आयुर्वेदिक संस्थान अभी भी कागजी फाइलों या एक्सेल पर निर्भर हैं, जिससे आयुष-जीसीपी नियमों के तहत अस्वीकृति का खतरा रहता है।',
        },
      ],
      reqsTitle: '8 मुख्य आवश्यकताएं एवं सूत्रमाइंड के समाधान',
      reqsDesc: 'आयुष मंत्रालय की सीटीएमएस आवश्यकता के प्रत्येक खंड का सूत्रमाइंड में समाधान।',
      reqs: [
        {
          num: '1',
          title: 'मानकीकृत आयुर्वेद डेटा संग्रह',
          prob: 'प्रकृति (7), अग्नि (4), बल (3), सत्व (3), व्याधि और अनुपान के लिए मानकीकृत फ़ील्ड्स का अभाव।',
          sol: 'सूत्रमाइंड सभी मुख्य आयुर्वेदिक अवधारणाओं के लिए नियंत्रित रिलेशनल मास्टर डिक्शनरी प्रदान करता है, जिससे 100% संरचित डेटा संग्रह सुनिश्चित होता है।',
        },
        {
          num: '2',
          title: 'द्विभाषी क्लिनिकल संचालन',
          prob: 'टियर-2/3 आयुर्वेदिक अनुसंधान अस्पताल मुख्य रूप से हिन्दी में काम करते हैं; केवल अंग्रेजी होने से डेटा त्रुटियां बढ़ती हैं।',
          sol: 'कैनोनिकल डेटाबेस कोड बदले बिना पूरे इंटरफ़ेस में अंग्रेजी और हिन्दी के बीच त्वरित स्विचिंग।',
        },
        {
          num: '3',
          title: 'स्वतंत्र आचार समिति (IEC) निगरानी',
          prob: 'रोगी की गोपनीयता से समझौता किए बिना आचार अनुमोदन स्थिति और वैधता तिथियों का सत्यापन।',
          sol: 'समर्पित आचार समिति कार्यस्थल जो रोगी के व्यक्तिगत स्वास्थ्य डेटा को देखे बिना आईईसी अनुमोदन स्थिति का प्रबंधन करता है।',
        },
        {
          num: '4',
          title: 'सख्त बहु-भूमिका एक्सेस नियंत्रण (RBAC)',
          prob: 'कर्तव्यों के पृथक्करण के अभाव से पक्षपातपूर्ण निगरानी और डेटा संघर्ष होता है।',
          sol: '6 स्पष्ट भूमिकाएं (PI, समन्वयक, मॉनिटर, आचार, एडमिन, PV)। समन्वयक डेटा दर्ज करते हैं; मॉनिटर समीक्षा करते हैं; पीआई समाधान बंद करते हैं।',
        },
        {
          num: '5',
          title: 'इलेक्ट्रॉनिक केस रिपोर्ट फॉर्म (eCRF) एवं डेटा फ्रीज',
          prob: 'कागजी फॉर्म या स्प्रेडशीट पूर्वव्यापी डेटा छेड़छाड़ की अनुमति देते हैं।',
          sol: 'डिजिटल सीआरएफ वाइटल्स, लक्षण और दवा अनुपालन दर्ज करते हैं, और पूर्ण होने पर स्वचालित रूप से केवल-पठनीय बन जाते हैं।',
        },
        {
          num: '6',
          title: 'डेटा विसंगति समाधान (क्वेरी वर्कफ़्लो)',
          prob: 'अस्पताल रिकॉर्ड और सीटीएमएस प्रविष्टियों के बीच विसंगतियां बिना ऑडिट ट्रेल के अनसुलझी रह जाती हैं।',
          sol: '3-स्तरीय क्वेरी चक्र: मॉनिटर प्रश्न उठाते हैं (OPEN) → समन्वयक साक्ष्य देते हैं (ANSWERED) → पीआई सत्यापन कर बंद करते हैं (CLOSED)।',
        },
        {
          num: '7',
          title: 'आयुष औषधि एवं फार्माकोविजिलेंस तैयारी',
          prob: 'आयुर्वेदिक योगों के लिए खुराक रूप, अनुपान और अवधि की निगरानी आवश्यक है।',
          sol: 'प्रोटोकॉल मॉडल शास्त्रीय योगों (वटी, चूर्ण, आसव, तैल) को विशिष्ट अनुपान (कोष्ण जल, मधु) से जोड़ता है।',
        },
        {
          num: '8',
          title: 'वैश्विक नियामक एवं सीडीआईएससी संगतता',
          prob: 'राष्ट्रीय परीक्षणों को अंतरराष्ट्रीय नियामकों को प्रस्तुत नहीं किया जा सकता।',
          sol: 'UUIDs और मानकीकृत स्कीमा पर निर्मित आर्किटेक्चर जो भविष्य में CDISC SDTM और FHIR R4 में निर्यात के लिए तैयार है।',
        },
      ],
      matrixTitle: 'सुविधा तुलना मैट्रिक्स',
      matrixDesc: 'कागजी परीक्षणों, सामान्य पश्चिमी सीटीएमएस और सूत्रमाइंड आयुर्वेद सीटीएमएस की तुलना।',
      matrixCols: ['नैदानिक आयाम', 'कागजी फाइलें / स्प्रेडशीट', 'पश्चिमी सीटीएमएस (वीवा/मेडिडाटा)', 'सूत्रमाइंड आयुर्वेद सीटीएमएस'],
      matrixRows: [
        {
          param: 'प्रकृति, अग्नि, बल, सत्व संग्रह',
          paper: 'हस्तलिखित / अनियंत्रित',
          generic: 'केवल अनस्ट्रक्चर्ड टेक्स्ट नोट्स',
          sutramind: 'संरचित रिलेशनल मास्टर कोड्स (P1-P7, A1-A4, B1-B3)',
        },
        {
          param: 'अनुपान (Anupana) ट्रैकिंग',
          paper: 'असंगत नोट्स',
          generic: 'असमर्थित',
          sutramind: 'मानकीकृत प्रोटोकॉल फ़ील्ड (AN01-AN08)',
        },
        {
          param: 'भाषा सुलभता',
          paper: 'मिश्रित हिन्दी / अंग्रेजी',
          generic: 'केवल अंग्रेजी',
          sutramind: 'तत्काल द्विभाषी (हिन्दी एवं अंग्रेजी)',
        },
        {
          param: 'भूमिका पृथक्करण (PI vs CRC vs CRA)',
          paper: 'शून्य (कोई भी लिख सकता है)',
          generic: 'जटिल एलोपैथिक भूमिकाएं',
          sutramind: '6 समर्पित आयुर्वेदिक नैदानिक भूमिकाएं',
        },
        {
          param: 'सीआरएफ लॉकिंग एवं अखंडता',
          paper: 'आसानी से पूर्वव्यापी बदलाव संभव',
          generic: 'अत्यधिक महंगा लाइसेंस आवश्यक',
          sutramind: 'मूल ड्राफ्ट से पूर्ण लॉक (Read-Only)',
        },
        {
          param: 'आचार समिति स्वतंत्रता',
          paper: 'कागजी फाइलें',
          generic: 'अतिरिक्त लागत वाला मॉड्यूल',
          sutramind: 'रोगी डेटा गोपनीयता के साथ समर्पित कार्यस्थल',
        },
        {
          param: 'लाइसेंसिंग एवं स्वामित्व लागत',
          paper: 'प्रारंभ में कम, भारी त्रुटि जोखिम',
          generic: '$100k+ प्रति परीक्षण',
          sutramind: 'आयुष संस्थानों के लिए सुलभ खुला मानक',
        },
      ],
      standardsTitle: 'नियामक मानक संरेखण',
      standardsDesc: 'सूत्रमाइंड भारतीय एवं वैश्विक नैदानिक अनुसंधान दिशानिर्देशों के अनुरूप बनाया गया है।',
      standards: [
        { name: 'आयुष जीसीपी दिशानिर्देश', org: 'आयुष मंत्रालय', desc: 'आयुर्वेद, सिद्ध और यूनानी में नैदानिक परीक्षणों के लिए गुड क्लिनिकल प्रैक्टिस नियमों का पालन।' },
        { name: 'शिड्यूल वाई / एनडीसीटीआर 2019', org: 'सीडीएससीओ भारत', desc: 'बहु-केंद्र नैदानिक परीक्षण आचार और सुरक्षा रिपोर्टिंग के लिए नए औषधि नियमों का अनुपालन।' },
        { name: 'यूएस एफडीए 21 सीएफआर पार्ट 11', org: 'यूएस फूड एंड ड्रग एडमिन', desc: 'रीड-ओनली फॉर्म फ्रीज, भूमिका पृथक्करण और अपरिवर्तनीय ऑडिट ट्रेल की नींव।' },
        { name: 'आईसीएमआर बायोएथिक्स कोड', org: 'भारतीय आयुर्विज्ञान अनुसंधान परिषद', desc: 'आचार समीक्षकों से व्यक्तिगत पहचान छिपाकर प्रतिभागी गोपनीयता लागू करता है।' },
      ],
    },
  }[lang];

  return (
    <div className="saas-animate-fade" style={{ padding: '48px 0 80px' }}>
      <div className="saas-container">
        {/* Header Title */}
        <div className="saas-section-header" style={{ marginBottom: '40px' }}>
          <div className="saas-pill">
            <span className="saas-pill-dot" />
            <span>{t.badge}</span>
          </div>
          <h1 className="saas-section-title" style={{ marginTop: '16px' }}>{t.title}</h1>
          <p className="saas-section-desc">{t.subtitle}</p>
        </div>

        {/* The Core Crisis Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(197, 155, 39, 0.08), rgba(15, 89, 83, 0.04))',
            borderRadius: 'var(--saas-radius-lg)',
            border: '1px solid rgba(197, 155, 39, 0.25)',
            padding: '36px',
            marginBottom: '56px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ background: '#fef3c7', color: '#b45309', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--saas-primary-dark)', margin: 0 }}>
              {t.crisisTitle}
            </h2>
          </div>

          <p style={{ fontSize: '1.02rem', color: 'var(--saas-text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
            {t.crisisDesc}
          </p>

          <div className="saas-grid-3">
            {t.crisisPoints.map((pt, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--saas-surface)',
                  padding: '24px',
                  borderRadius: 'var(--saas-radius-md)',
                  border: '1px solid var(--saas-border)',
                  boxShadow: 'var(--saas-shadow-sm)',
                }}
              >
                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Problem 0{idx + 1}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 750, color: 'var(--saas-primary-dark)', marginBottom: '8px' }}>
                  {pt.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--saas-text-muted)', lineHeight: 1.5 }}>
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 8 Core PS Requirements */}
        <div style={{ marginBottom: '64px' }}>
          <div className="saas-section-header">
            <div className="saas-section-tag">Systemic Solution Architecture</div>
            <h2 className="saas-section-title">{t.reqsTitle}</h2>
            <p className="saas-section-desc">{t.reqsDesc}</p>
          </div>

          <div className="saas-grid-2">
            {t.reqs.map((r, idx) => (
              <div key={idx} className="saas-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div className="saas-step-badge" style={{ margin: 0, width: '28px', height: '28px', fontSize: '0.8rem' }}>
                    {r.num}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--saas-primary-dark)', margin: 0 }}>
                    {r.title}
                  </h3>
                </div>

                <div style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444', padding: '10px 14px', borderRadius: '4px', marginBottom: '12px', fontSize: '0.86rem', color: '#991b1b' }}>
                  <strong>The Gap:</strong> {r.prob}
                </div>

                <div style={{ background: '#f0fdf4', borderLeft: '3px solid #16a34a', padding: '10px 14px', borderRadius: '4px', fontSize: '0.88rem', color: '#166534', lineHeight: 1.5 }}>
                  <strong>SutraMind Resolution:</strong> {r.sol}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix */}
        <div style={{ marginBottom: '64px' }}>
          <div className="saas-section-header">
            <div className="saas-section-tag">Direct Evaluation</div>
            <h2 className="saas-section-title">{t.matrixTitle}</h2>
            <p className="saas-section-desc">{t.matrixDesc}</p>
          </div>

          <div className="saas-table-wrapper">
            <table className="saas-table">
              <thead>
                <tr>
                  {t.matrixCols.map((c, idx) => (
                    <th key={idx} className={idx === 3 ? 'highlight' : ''}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.matrixRows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: 'var(--saas-primary-dark)' }}>{row.param}</td>
                    <td style={{ color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                        <span>{row.paper}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                        <span>{row.generic}</span>
                      </div>
                    </td>
                    <td className="highlight">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f5953' }}>
                        <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                        <span>{row.sutramind}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Standards Section */}
        <div style={{ marginBottom: '56px' }}>
          <div className="saas-section-header">
            <div className="saas-section-tag">Framework Alignment</div>
            <h2 className="saas-section-title">{t.standardsTitle}</h2>
            <p className="saas-section-desc">{t.standardsDesc}</p>
          </div>

          <div className="saas-grid-4">
            {t.standards.map((std, idx) => (
              <div key={idx} className="saas-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--saas-gold-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {std.org}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: 'var(--saas-primary-dark)', marginBottom: '8px' }}>
                  {std.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--saas-text-muted)', lineHeight: 1.5 }}>
                  {std.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '36px', background: 'var(--saas-surface)', borderRadius: 'var(--saas-radius-lg)', border: '1px solid var(--saas-border)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--saas-primary-dark)', marginBottom: '8px' }}>
            Ready to test this solution on live trial data?
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--saas-text-muted)', marginBottom: '24px' }}>
            Launch the clinical workbench to see how SutraMind handles structured baseline assessment and eCRF locking.
          </p>
          <button className="saas-btn-gold" onClick={onLaunchApp}>
            <span>Launch CTMS Platform</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
