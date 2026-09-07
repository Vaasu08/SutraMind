import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Database,
  Lock,
  Languages,
  CheckCircle2,
  XCircle,
  Scale,
} from "lucide-react";

interface HomePageProps {
  onNavigate: (page: "home" | "dashboard" | "problem" | "progress") => void;
  onLaunchApp: () => void;
  lang: "en" | "hi";
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLaunchApp, lang }) => {
  const [activeRoleTab, setActiveRoleTab] = useState<"pi" | "coordinator" | "monitor" | "ethics" | "admin" | "pv">("pi");

  const t = {
    en: {
      badge: "AYUSH-GCP Compliant • 21 CFR Part 11 Architecture • SIH 2026",
      heroTitlePrefix: "The Native Clinical Trial Management System for ",
      heroTitleHighlight: "Ayurveda Research",
      heroDesc:
        "Bridge classical Ayurvedic clinical observations (Prakriti, Agni, Bala, Satva, Anupana) with global clinical trial rigor (Good Clinical Practice, Schedule Y, 21 CFR Part 11, CDISC SDTM).",
      ctaLaunch: "Launch Clinical Workbench",
      ctaProblem: "Review Clinical Requirements",
      
      // Institutional Regulatory Trust Bar
      trustHeader: "Statutory Compliance & Regulatory Alignment",
      trustAuditTag: "12/12 Automated Integration Tests Verified",
      trustItems: [
        {
          title: "AYUSH-GCP (2013)",
          desc: "Section 3.2 Protocol design & independent IEC ethical oversight",
        },
        {
          title: "Schedule Y / NDCTR 2019",
          desc: "ASU&H clinical trials under CDSCO regulatory framework",
        },
        {
          title: "US FDA 21 CFR Part 11",
          desc: "Electronic records, completed form locking & source verification",
        },
        {
          title: "CDISC SDTM Ready",
          desc: "Normalized schema prepared for international dossier submissions",
        },
      ],

      // Clinical Differentiation (Free-Text Trap)
      diffTag: 'Core Innovation',
      diffTitle: 'Eliminating the "Free-Text Trap" in Traditional Medicine',
      diffDesc:
        'Conventional Western CTMS platforms force clinical investigators to stuff Ayurvedic diagnostic markers into unstructured comment boxes. SutraMind structures every classical observation natively.',
      genericTitle: 'Conventional Western CTMS (Veeva / Medidata / Oracle)',
      genericSub: 'Ayurvedic diagnostics forced into plain unstructured textareas — impossible to query statistically',
      genericSnippet:
        'CRF Note Field (Free Text):\n"Subject reports Vata-Kapha Prakriti, irregular Mandagni, moderate Bala. Prescribed Yogaraja Guggulu 2 tablets with warm water. Progress evaluated next week."\n\nStatus: UNSTRUCTURED TEXT • UNINDEXED • NO SCHEMA VALIDATION',
      genericPoints: [
        'Prakriti, Agni, and Bala are trapped in free-text notes and cannot be queried across multi-center cohorts.',
        'Zero statistical regression capability between doshic baseline phenotypes and clinical drug efficacy.',
        'High risk of audit failure and regulatory non-acceptance under AYUSH GCP and Schedule Y.',
        'No schema definitions for classical ASU&H dosage forms, formulations, or carrier vehicles (Anupana).',
      ],
      sutramindTitle: 'SutraMind Native CTMS Architecture',
      sutramindSub: 'Indexed relational master dictionaries preserving clinical rigor and international compliance',
      sutramindSnippet:
        'Relational Schema Tokens (Master Indexed):\n  Prakriti: P6 [Vata-Kapha] | Agni: A2 [Tikshnagni] | Bala: B2 [Madhyama]\n  Intervention: ASU-042 [Yogaraja Guggulu] | Form: DF01 [Vati]\n  Adjuvant: AN01 [Koshna Jala / Warm Water]\n\nStatus: INDEXED RELATIONAL TOKENS • 21 CFR PART 11 LOCKED • CDISC SDTM READY',
      sutramindPoints: [
        '100% structured relational capture of 7 Prakriti, 4 Agni, 3 Bala, 3 Satva, and classical Vyadhi.',
        'Direct multi-variate statistical queries correlating baseline constitution with trial outcomes.',
        'Completed eCRFs freeze into immutable read-only records to guarantee data integrity.',
        'Bilingual English/Hindi interface built for rapid adoption at tier-2/3 Ayurvedic hospital trial sites.',
      ],

      workflowTitle: "End-to-End Ayurvedic Clinical Trial Lifecycle",
      workflowDesc: "A unified clinical journey from protocol definition to regulatory KPI aggregation.",
      steps: [
        {
          num: "1",
          title: "Protocol & Ethics Setup",
          desc: "Configure study parameters, Vyadhi diagnosis, classical intervention, Anupana, and track IEC review.",
        },
        {
          num: "2",
          title: "Participant Enrollment",
          desc: "Enrol subjects with age, gender, randomization IDs, and study site allocation.",
        },
        {
          num: "3",
          title: "5-Point Ayurveda Baseline",
          desc: "Record constitutional Prakriti, digestive Agni, physical Bala, mental Satva, and Vikriti symptoms.",
        },
        {
          num: "4",
          title: "Digital CRF & Vitals Capture",
          desc: "Conduct scheduled visits, record interval vitals, drug compliance, and lock completed forms.",
        },
        {
          num: "5",
          title: "Field Discrepancy Queries",
          desc: "CRA monitors raise field-level queries; coordinators submit evidence; PIs close resolutions.",
        },
        {
          num: "6",
          title: "Real-Time Research KPIs",
          desc: "Instant aggregation of recruitment progress, adherence rates, Prakriti distribution, and ethics status.",
        },
      ],

      pillarsTitle: "Engineered Specifically for Ayurveda",
      pillarsDesc: "Solving the structural mismatch between classical Ayurvedic diagnostics and global clinical compliance.",
      pillars: [
        {
          icon: <Database className="w-6 h-6" />,
          title: "Structured Ayurveda Ontology",
          desc: 'Eliminates the "unstructured text box trap" by providing controlled master dictionaries for Prakriti, Agni, Bala, Satva, and classical formulations.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: "Multi-Role Segregation of Duties",
          desc: "Enforces strict clinical trial boundaries between Investigators (PI), Coordinators, Monitors (CRA), Ethics Committees (IEC), and Administrators.",
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: "Data Integrity & Form Locking",
          desc: "CRFs support drafting during patient visits and automatically freeze into read-only records upon completion, preventing retroactive alteration.",
        },
        {
          icon: <Languages className="w-6 h-6" />,
          title: "Bilingual Clinical Operation",
          desc: "Full English and Hindi localization enables tier-2/3 Ayurvedic hospital coordinators and traditional Vaidyas to record clinical data with ease.",
        },
      ],

      rolesTitle: "Role-Based Workspaces & Governance Boundaries",
      rolesDesc: "Inspect the operational permissions and responsibilities enforced for each trial stakeholder.",
      roles: {
        pi: {
          name: "Principal Investigator (PI)",
          badge: "Trial Governance & Protocol Owner",
          desc: "PIs design and initiate clinical trials, specify protocol Vyadhi mappings and Anupana, govern site teams, verify coordinator query responses, and monitor research KPIs.",
          items: [
            "Trial creation and protocol version control",
            "Final query closure and discrepancy arbitration",
            "Study activation following IEC approval",
            "Full trial participant oversight and KPI analytics",
          ],
        },
        coordinator: {
          name: "Clinical Research Coordinator (CRC)",
          badge: "Data Entry & Patient Interaction",
          desc: "Coordinators work directly with participants at trial sites, capturing baseline Ayurvedic evaluations, scheduling follow-ups, filling eCRFs, and responding to monitor queries.",
          items: [
            "Participant enrollment and randomization ID assignment",
            "5-Point Ayurveda baseline recording (Prakriti, Agni, Bala, Satva)",
            "Visit scheduling and eCRF clinical data entry",
            "Query response with clinical source verification notes",
          ],
        },
        monitor: {
          name: "Clinical Research Associate (Monitor / CRA)",
          badge: "Source Data Verification (SDV)",
          desc: "Monitors independently verify clinical trial records against hospital source documents, detect anomalies, and raise field-specific discrepancy queries. Monitors cannot edit trial data.",
          items: [
            "Read-only access to enrolled participant CRFs and visits",
            "Field-level discrepancy query generation (weight, BP, vitals)",
            "Monitoring visit progress and data completeness",
            "Zero edit permissions on primary clinical records",
          ],
        },
        ethics: {
          name: "Institutional Ethics Committee (IEC)",
          badge: "Ethical Oversight & Patient Privacy",
          desc: "Ethics committee members oversee ethical clearance, approval renewals, and protocol compliance. To preserve patient confidentiality, ethics users cannot see participant health records.",
          items: [
            "IEC approval number, decision status, and validity dates",
            "Continuing ethics review and renewal tracking",
            "Zero access to identifying participant medical data",
            "Independent regulatory audit readiness",
          ],
        },
        admin: {
          name: "System Administrator",
          badge: "Access Control & Vocabulary Governance",
          desc: "Administrators manage user accounts, assign team roles to study sites, and maintain the controlled Ayurvedic master dictionary without disrupting existing records.",
          items: [
            "User provisioning across all 6 clinical roles",
            "Controlled terminology activation / deactivation",
            "Addition of new Ayurvedic formulations and diagnosis terms",
            "Global trial oversight across all registered institutions",
          ],
        },
        pv: {
          name: "Pharmacovigilance (PV) Officer",
          badge: "Safety Surveillance Framework",
          desc: "Safety officers monitor study metadata and trial interventions, preparing for adverse event tracking and post-market safety surveillance of ASU&H medicines.",
          items: [
            "Intervention and formulation safety surveillance",
            "Monitoring study activation and adherence statistics",
            "Foundation for Phase 2 expedited AE/SAE reporting",
          ],
        },
      },
      ctaBannerTitle: "Ready to Test SutraMind with Live Clinical Data?",
      ctaBannerDesc: "Experience pre-seeded demo accounts across all 6 clinical roles, or explore live study dashboards in your browser.",
      ctaBannerBtn: "Open Clinical Workbench",
      ctaBannerSecondary: "View Research KPI Analytics",
    },
    hi: {
      badge: "आयुष-जीसीपी अनुपालक • 21 सीएफआर पार्ट 11 संरचना • एसआईएच 2026",
      heroTitlePrefix: "आयुर्वेद अनुसंधान हेतु समर्पित ",
      heroTitleHighlight: "क्लीनिकल ट्रायल मैनेजमेंट सिस्टम",
      heroDesc:
        "पारंपरिक आयुर्वेदिक प्रेक्षणों (प्रकृति, अग्नि, बल, सत्व, दोष, अनुपान) को वैश्विक नैदानिक मानकों (जीसीपी, शिड्यूल वाई, 21 सीएफआर पार्ट 11, सीडीआईएससी) से जोड़ें।",
      ctaLaunch: "क्लिनिकल वर्कबेंच शुरू करें",
      ctaProblem: "नैदानिक आवश्यकताएं देखें",

      trustHeader: "वैधानिक अनुपालन एवं नियामक मानक संरेखण",
      trustAuditTag: "12/12 स्वचालित टेस्ट सत्यापित",
      trustItems: [
        {
          title: "आयुष-जीसीपी (2013)",
          desc: "धारा 3.2 प्रोटोकॉल निर्धारण एवं स्वतंत्र आईईसी नैतिक निगरानी",
        },
        {
          title: "शिड्यूल वाई / एनडीसीटीआर 2019",
          desc: "सीडीएससीओ नियामक ढांचे के तहत एएसयू एवं एच नैदानिक परीक्षण",
        },
        {
          title: "यूएस एफडीए 21 सीएफआर पार्ट 11",
          desc: "इलेक्ट्रॉनिक रिकॉर्ड, पूर्ण फॉर्म लॉकिंग एवं स्रोत सत्यापन",
        },
        {
          title: "सीडीआईएससी एसडीएम तत्परता",
          desc: "अंतरराष्ट्रीय नियामक प्रस्तुतियों हेतु मानकीकृत डेटा संरचना",
        },
      ],

      diffTag: 'मुख्य नवाचार',
      diffTitle: 'पारंपरिक चिकित्सा में "मुक्त-पाठ्य जाल" का निवारण',
      diffDesc:
        'पारंपरिक पश्चिमी सीटीएमएस आयुर्वेदिक निदान को असंरचित टिप्पणी बॉक्स में डालने को विवश करते हैं। सूत्रमाइंड प्रत्येक शास्त्रीय प्रेक्षण को मूल रूप से संरचित करता है।',
      genericTitle: 'पारंपरिक पश्चिमी सीटीएमएस (Veeva / Medidata / Oracle)',
      genericSub: 'असंरचित पाठ्य क्षेत्रों में बाध्य — सांख्यिकीय विश्लेषण असंभव',
      genericSnippet:
        'सीआरएफ टिप्पणी फ़ील्ड (असंरचित मुक्त पाठ्य):\n"रोगी वात-कफ प्रकृति, मंदाग्नि, मध्यम बल दर्शाता है। योगराज गुग्गुलु 2 गोली उष्ण जल के साथ दी गई।"\n\nस्थिति: असंरचित पाठ्य • अनुक्रमणिका अनुपस्थित • कोई स्कीमा सत्यापन नहीं',
      genericPoints: [
        'प्रकृति, अग्नि और बल सामान्य टिप्पणियों में खो जाते हैं और विभिन्न केंद्रों के बीच खोजे नहीं जा सकते।',
        'दोषीय बेसलाइन और नैदानिक प्रभावकारिता के बीच सांख्यिकीय संबंध निकालना असंभव है।',
        'आयुष जीसीपी और शिड्यूल वाई के अंतर्गत ऑडिट में अस्वीकृति का गंभीर जोखिम।',
        'शास्त्रीय औषधियों के रूप या अनुपान के लिए कोई मानकीकृत फ़ील्ड नहीं।',
      ],
      sutramindTitle: 'सूत्रमाइंड नेटिव सीटीएमएस संरचना',
      sutramindSub: 'सूचकांक-युक्त रिलेशनल मास्टर डिक्शनरी जो नैदानिक सत्यता बनाए रखती है',
      sutramindSnippet:
        'संरचित रिलेशनल टोकन (मास्टर अनुक्रमित):\n  प्रकृति: P6 [वात-कफ] | अग्नि: A2 [तीक्ष्णाग्नि] | बल: B2 [मध्यम]\n  औषध: ASU-042 [योगराज गुग्गुलु] | रूप: DF01 [वटी]\n  अनुपान: AN01 [उष्ण जल]\n\nस्थिति: अनुक्रमित रिलेशनल टोकन • 21 सीएफआर लॉक्ड • अंतरराष्ट्रीय सबमिशन हेतु तैयार',
      sutramindPoints: [
        '7 प्रकृति, 4 अग्नि, 3 बल, 3 सत्व और शास्त्रीय व्याधि का 100% संरचित डेटा संग्रह।',
        'आधारभूत प्रकृति और उपचार परिणामों के बीच प्रत्यक्ष बहु-आयामी सांख्यिकीय विश्लेषण।',
        'डेटा की प्रामाणिकता सुनिश्चित करने के लिए पूर्ण सीआरएफ स्वचालित रूप से लॉक हो जाते हैं।',
        'टियर-2 और टियर-3 आयुर्वेदिक अस्पतालों के लिए सरल द्विभाषी अंग्रेजी/हिन्दी संचालन।',
      ],

      workflowTitle: "सम्पूर्ण आयुर्वेदिक नैदानिक कार्यप्रवाह",
      workflowDesc: "प्रोटोकॉल परिभाषा से लेकर नियामक केपीआई तक एक एकीकृत यात्रा।",
      steps: [
        {
          num: "1",
          title: "प्रोटोकॉल एवं आचार समिति",
          desc: "अध्ययन पैरामीटर, व्याधि निदान, शास्त्रीय औषधि, अनुपान और आईईसी स्वीकृति दर्ज करें।",
        },
        {
          num: "2",
          title: "प्रतिभागी नामांकन",
          desc: "उम्र, लिंग, रैंडमाइजेशन आईडी और अध्ययन केंद्र के साथ प्रतिभागियों का नामांकन करें।",
        },
        {
          num: "3",
          title: "5-बिंदु आयुर्वेद बेसलाइन",
          desc: "प्रकृति, जठराग्नि, शारीरिक बल, मानसिक सत्व और विकृति लक्षणों का रिकॉर्ड रखें।",
        },
        {
          num: "4",
          title: "डिजिटल सीआरएफ और वाइटल्स",
          desc: "निर्धारित विज़िट करें, वाइटल्स, औषधि अनुपालन दर्ज करें और पूर्ण फॉर्म को लॉक करें।",
        },
        {
          num: "5",
          title: "डेटा विसंगति समाधान (क्वेरी)",
          desc: "मॉनिटर प्रश्न उठाते हैं; समन्वयक उत्तर देते हैं; मुख्य अन्वेषक (PI) समाधान बंद करते हैं।",
        },
        {
          num: "6",
          title: "वास्तविक समय अनुसंधान केपीआई",
          desc: "भर्ती प्रगति, दवा अनुपालन दर, प्रकृति वितरण और आचार स्थिति का त्वरित विश्लेषण।",
        },
      ],

      pillarsTitle: "विशेष रूप से आयुर्वेद के लिए निर्मित",
      pillarsDesc: "पारंपरिक आयुर्वेदिक निदान और वैश्विक नैदानिक मानकों के बीच की खाई को पाटना।",
      pillars: [
        {
          icon: <Database className="w-6 h-6" />,
          title: "संरचित आयुर्वेद शब्दावली",
          desc: "प्रकृति, अग्नि, बल, सत्व और शास्त्रीय औषधियों के लिए नियंत्रित मास्टर डिक्शनरी प्रदान करता है।",
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: "भूमिका-आधारित सख्त नियंत्रण",
          desc: "मुख्य अन्वेषक, समन्वयक, मॉनिटर, आचार समिति और एडमिन के बीच कार्य विभाजन लागू करता है।",
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: "डेटा अखंडता एवं फॉर्म लॉकिंग",
          desc: "पूर्ण सीआरएफ स्वचालित रूप से केवल-पठनीय बन जाते हैं, जिससे पूर्वव्यापी छेड़छाड़ रुकती है।",
        },
        {
          icon: <Languages className="w-6 h-6" />,
          title: "द्विभाषी संचालन (हिन्दी/अंग्रेजी)",
          desc: "टियर-2/3 आयुर्वेदिक अस्पतालों और पारंपरिक वैद्यों के लिए आसान नैदानिक डेटा प्रविष्टि।",
        },
      ],

      rolesTitle: "भूमिका-आधारित कार्यस्थल एवं नियंत्रण सीमाएं",
      rolesDesc: "प्रत्येक हितधारक के लिए निर्धारित परिचालन अधिकारों और जिम्मेदारियों का निरीक्षण करें।",
      roles: {
        pi: {
          name: "मुख्य अन्वेषक (PI)",
          badge: "ट्रायल प्रशासन एवं प्रोटोकॉल स्वामी",
          desc: "पीआई अध्ययन शुरू करते हैं, प्रोटोकॉल और अनुपान तय करते हैं, टीम नियंत्रित करते हैं और अंतिम क्वेरी बंद करते हैं।",
          items: [
            "ट्रायल निर्माण और प्रोटोकॉल संस्करण नियंत्रण",
            "अंतिम क्वेरी समाधान और विवाद मध्यस्थता",
            "आईईसी अनुमोदन के बाद अध्ययन सक्रियण",
            "प्रतिभागी निगरानी और केपीआई विश्लेषण",
          ],
        },
        coordinator: {
          name: "अध्ययन समन्वयक (CRC)",
          badge: "डेटा प्रविष्टि एवं रोगी संपर्क",
          desc: "समन्वयक बेसलाइन आयुर्वेद मूल्यांकन दर्ज करते हैं, विज़िट शेड्यूल करते हैं और मॉनिटर प्रश्नों के उत्तर देते हैं।",
          items: [
            "प्रतिभागी नामांकन और रैंडमाइजेशन कोड",
            "5-बिंदु आयुर्वेद बेसलाइन (प्रकृति, अग्नि, बल, सत्व)",
            "विज़िट शेड्यूलिंग और सीआरएफ डेटा प्रविष्टि",
            "स्रोत डेटा सत्यापन के साथ क्वेरी उत्तर",
          ],
        },
        monitor: {
          name: "क्लिनिकल मॉनिटर (CRA)",
          badge: "स्रोत डेटा सत्यापन (SDV)",
          desc: "मॉनिटर स्वतंत्र रूप से रिकॉर्ड की जांच करते हैं और विसंगति प्रश्न उठाते हैं। वे डेटा बदल नहीं सकते।",
          items: [
            "सीआरएफ और विज़िट्स का केवल-पठनीय अवलोकन",
            "विशिष्ट फ़ील्ड विसंगति प्रश्न (वजन, बीपी, वाइटल्स)",
            "डेटा पूर्णता और प्रोटोकॉल अनुपालन जांच",
            "प्राथमिक रिकॉर्ड पर शून्य संपादन अधिकार",
          ],
        },
        ethics: {
          name: "संस्थागत आचार समिति (IEC)",
          badge: "नैतिक निगरानी एवं गोपनीयता",
          desc: "आचार समिति अनुमोदन संख्या, निर्णय और वैधता की निगरानी करती है। वे रोगी का व्यक्तिगत डेटा नहीं देख सकते।",
          items: [
            "आईईसी अनुमोदन संख्या और स्थिति ट्रैकिंग",
            "निरंतर समीक्षा और नवीनीकरण प्रबंधन",
            "रोगी के व्यक्तिगत डेटा पर शून्य पहुंच",
            "नियामक ऑडिट तैयारी",
          ],
        },
        admin: {
          name: "सिस्टम एडमिनिस्ट्रेटर",
          badge: "एक्सेस नियंत्रण एवं शब्दावली प्रबंधन",
          desc: "उपयोगकर्ता खाते बनाते हैं और रिकॉर्ड तोड़े बिना नियंत्रित आयुर्वेद मास्टर डिक्शनरी प्रबंधित करते हैं।",
          items: [
            "सभी 6 भूमिकाओं में उपयोगकर्ता प्रबंधन",
            "मास्टर शब्दावली सक्रिय/निष्क्रिय करना",
            "नई आयुर्वेदिक औषधियों और व्याधियों का समावेश",
            "सभी संस्थानों में वैश्विक परीक्षण प्रबंधन",
          ],
        },
        pv: {
          name: "फार्माकोविजिलेंस (PV) अधिकारी",
          badge: "सुरक्षा निगरानी ढांचा",
          desc: "दवाओं की सुरक्षा निगरानी और प्रतिकूल घटनाओं (AE/SAE) की रिपोर्टिंग के लिए अध्ययन डेटा की निगरानी।",
          items: [
            "शास्त्रीय योगों की सुरक्षा निगरानी",
            "अध्ययन सक्रियण और अनुपालन आंकड़े",
            "फेज 2 त्वरित रिपोर्टिंग का आधार",
          ],
        },
      },
      ctaBannerTitle: "क्या आप सूत्रमाइंड सीटीएमएस देखने के लिए तैयार हैं?",
      ctaBannerDesc: "सभी 6 भूमिकाओं के लिए पूर्व-निर्मित डेमो खातों से लॉग इन करें या लाइव अध्ययन डैशबोर्ड देखें।",
      ctaBannerBtn: "क्लिनिकल वर्कबेंच शुरू करें",
      ctaBannerSecondary: "अनुसंधान केपीआई देखें",
    },
  }[lang];

  const currentRole = t.roles[activeRoleTab];

  return (
    <div className="saas-animate-fade">
      {/* Hero Section */}
      <section className="saas-hero">
        <div className="saas-container">
          <div className="saas-hero-content">
            <div className="saas-pill">
              <span className="saas-pill-dot" />
              <span>{t.badge}</span>
            </div>

            <h1 className="saas-hero-title">
              {t.heroTitlePrefix}
              <span className="highlight">{t.heroTitleHighlight}</span>
            </h1>

            <p className="saas-hero-desc">{t.heroDesc}</p>

            <div className="saas-hero-ctas">
              <button className="saas-btn-gold" onClick={onLaunchApp}>
                <span>{t.ctaLaunch}</span>
                <ArrowRight size={16} />
              </button>
              <button className="saas-btn-secondary" onClick={() => onNavigate("problem")}>
                <span>{t.ctaProblem}</span>
              </button>
            </div>

            {/* Clinical Electronic Workbench Preview */}
            <div className="saas-hero-preview">
              <div className="saas-mockup-header">
                <div className="saas-protocol-meta">
                  <span className="saas-protocol-badge">CTRI/2026/08/045210</span>
                  <span>PROTOCOL AMAVATA-001 (Phase II)</span>
                  <span style={{ color: "var(--saas-border)" }}>|</span>
                  <span style={{ color: "var(--saas-text-muted)" }}>Site: AIIA New Delhi</span>
                </div>
                <span className="saas-status-badge completed">● AYUSH-GCP VALIDATED</span>
              </div>

              <div className="saas-mockup-body">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid var(--saas-border)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Trial Protocol & Diagnosis</div>
                    <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--saas-primary-dark)", marginTop: "4px" }}>Amavata (Rheumatoid Arthritis)</div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>MedDRA Mapping: 10039073 • Schedule Y Phase II</div>
                  </div>

                  <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid var(--saas-border)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>IEC Ethics Clearance</div>
                    <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>DECISION: APPROVED</div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>IEC Reg # AIIA-IEC-2026-001 • Blinded to Identifiers</div>
                  </div>

                  <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid var(--saas-border)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Structured Ayurveda Baseline</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                      <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "0.74rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>Prakriti: P6 (Vata-Kapha)</span>
                      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.74rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>Agni: A2 (Tikshnagni)</span>
                      <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.74rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>Bala: B2 (Madhyama)</span>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid var(--saas-border)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Intervention & Vehicle (Anupana)</div>
                    <div style={{ fontSize: "0.94rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>Yogaraja Guggulu (Vati / DF01)</div>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>Anupana: Koshna Jala (Warm Water • AN01)</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid var(--saas-border)", fontSize: "0.84rem", color: "#64748b", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lock size={14} color="#0f5953" />
                    <span>eCRF Freeze on Completion • 21 CFR Part 11 Electronic Records Ready</span>
                  </span>
                  <button
                    onClick={onLaunchApp}
                    style={{ background: "none", border: "none", color: "var(--saas-primary)", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>Launch live clinical workbench</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional & Statutory Trust Bar */}
      <section className="saas-container">
        <div className="saas-trust-bar">
          <div className="saas-trust-header">
            <span className="saas-trust-label">
              <Scale size={16} />
              <span>{t.trustHeader}</span>
            </span>
            <span className="saas-trust-audit">{t.trustAuditTag}</span>
          </div>
          <div className="saas-trust-grid">
            {t.trustItems.map((item, idx) => (
              <div key={idx} className="saas-trust-item">
                <div className="saas-trust-title">{item.title}</div>
                <div className="saas-trust-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Side-by-Side Clinical Differentiation: The Free-Text Trap */}
      <section className="saas-section" style={{ background: "var(--saas-surface)" }}>
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">{t.diffTag}</div>
            <h2 className="saas-section-title">{t.diffTitle}</h2>
            <p className="saas-section-desc">{t.diffDesc}</p>
          </div>

          <div className="saas-diff-container">
            <div className="saas-diff-grid">
              {/* The Free-Text Trap Card */}
              <div className="saas-diff-card negative">
                <div className="saas-diff-badge red">
                  <XCircle size={14} />
                  <span>The Conventional Failure</span>
                </div>
                <h3 className="saas-diff-title">{t.genericTitle}</h3>
                <p className="saas-diff-sub">{t.genericSub}</p>

                <div className="saas-diff-preview">
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit", lineHeight: 1.5 }}>
                    {t.genericSnippet}
                  </pre>
                </div>

                <ul className="saas-diff-list">
                  {t.genericPoints.map((pt, idx) => (
                    <li key={idx} className="saas-diff-point">
                      <XCircle size={16} color="#ef4444" style={{ minWidth: 16, marginTop: 2 }} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SutraMind Solution Card */}
              <div className="saas-diff-card positive">
                <div className="saas-diff-badge teal">
                  <CheckCircle2 size={14} />
                  <span>The SutraMind Architecture</span>
                </div>
                <h3 className="saas-diff-title">{t.sutramindTitle}</h3>
                <p className="saas-diff-sub">{t.sutramindSub}</p>

                <div className="saas-diff-preview" style={{ background: "#f0fdfa", borderColor: "#ccfbf1" }}>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit", lineHeight: 1.5, color: "#0f766e" }}>
                    {t.sutramindSnippet}
                  </pre>
                </div>

                <ul className="saas-diff-list">
                  {t.sutramindPoints.map((pt, idx) => (
                    <li key={idx} className="saas-diff-point">
                      <CheckCircle2 size={16} color="#0f766e" style={{ minWidth: 16, marginTop: 2 }} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section className="saas-section" style={{ background: "var(--saas-surface-muted)" }}>
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">Lifecycle Management</div>
            <h2 className="saas-section-title">{t.workflowTitle}</h2>
            <p className="saas-section-desc">{t.workflowDesc}</p>
          </div>

          <div className="saas-workflow-steps">
            {t.steps.map((step, idx) => (
              <div key={idx} className="saas-step-card">
                <div className="saas-step-badge">{step.num}</div>
                <h3 className="saas-step-title">{step.title}</h3>
                <p className="saas-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="saas-section">
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">Core Value Proposition</div>
            <h2 className="saas-section-title">{t.pillarsTitle}</h2>
            <p className="saas-section-desc">{t.pillarsDesc}</p>
          </div>

          <div className="saas-grid-2">
            {t.pillars.map((pillar, idx) => (
              <div key={idx} className="saas-card">
                <div className="saas-card-icon">{pillar.icon}</div>
                <h3 className="saas-card-title">{pillar.title}</h3>
                <p className="saas-card-text">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Explorer */}
      <section className="saas-section" style={{ background: "var(--saas-surface-muted)" }}>
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">Role-Based Access Control (RBAC)</div>
            <h2 className="saas-section-title">{t.rolesTitle}</h2>
            <p className="saas-section-desc">{t.rolesDesc}</p>
          </div>

          <div className="saas-tabs-header">
            {(["pi", "coordinator", "monitor", "ethics", "admin", "pv"] as const).map((roleKey) => (
              <button
                key={roleKey}
                className={`saas-tab-btn ${activeRoleTab === roleKey ? "active" : ""}`}
                onClick={() => setActiveRoleTab(roleKey)}
              >
                {t.roles[roleKey].name.split(" (")[0]}
              </button>
            ))}
          </div>

          <div className="saas-tab-content saas-animate-fade" key={activeRoleTab}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--saas-primary-dark)" }}>
                {currentRole.name}
              </h3>
              <span className="saas-status-badge completed">{currentRole.badge}</span>
            </div>

            <p style={{ fontSize: "1.05rem", color: "var(--saas-text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
              {currentRole.desc}
            </p>

            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", color: "var(--saas-primary)", marginBottom: "12px" }}>
              Key Role Responsibilities & Permissions:
            </h4>

            <ul className="saas-checklist">
              {currentRole.items.map((item, idx) => (
                <li key={idx} className="saas-checklist-item">
                  <div className="saas-check-icon green">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="saas-container">
        <div className="saas-cta-banner">
          <h2 className="saas-cta-title">{t.ctaBannerTitle}</h2>
          <p className="saas-cta-desc">{t.ctaBannerDesc}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button className="saas-btn-gold" onClick={onLaunchApp}>
              <span>{t.ctaBannerBtn}</span>
              <ArrowRight size={16} />
            </button>
            <button
              className="saas-btn-secondary"
              style={{ background: "transparent", color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => onNavigate("dashboard")}
            >
              <span>{t.ctaBannerSecondary}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
