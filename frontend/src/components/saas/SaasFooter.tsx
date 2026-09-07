import React from 'react';

interface SaasFooterProps {
  onNavigate: (page: 'home' | 'dashboard' | 'problem' | 'progress') => void;
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
}

export const SaasFooter: React.FC<SaasFooterProps> = ({ onNavigate, onLaunchApp, lang }) => {
  const t = {
    en: {
      brandDesc:
        'SutraMind is an Ayurveda-native Clinical Trial Management System bridging classical observational medicine with global GCP, Schedule Y, and 21 CFR Part 11 compliance.',
      pagesTitle: 'Platform Navigation',
      home: 'Home Overview',
      dashboard: 'Interactive Dashboard',
      problem: 'Problem Statement & Analysis',
      progress: 'Engineering Roadmap',
      launch: 'Launch Clinical CTMS',
      complianceTitle: 'Standards Alignment',
      c1: 'AYUSH-GCP Guidelines',
      c2: 'Schedule Y / NDCTR 2019',
      c3: 'US FDA 21 CFR Part 11 Ready',
      c4: 'CDISC SDTM Data Architecture',
      hackathonTitle: 'Hackathon Initiative',
      h1: 'Smart India Hackathon 2026',
      h2: 'Ministry of Ayush, Govt of India',
      h3: 'Phase 1 Prototype Deliverable',
      copyright: '© 2026 SutraMind CTMS. Built for Smart India Hackathon 2026.',
      disclaimer: 'For clinical research, educational evaluation, and demonstration purposes.',
    },
    hi: {
      brandDesc:
        'सूत्रमाइंड आयुर्वेद-अनुकूल क्लिनिकल ट्रायल मैनेजमेंट सिस्टम है, जो पारंपरिक प्रेक्षणात्मक चिकित्सा को वैश्विक जीसीपी और 21 सीएफआर पार्ट 11 मानकों से जोड़ता है।',
      pagesTitle: 'प्लेटफ़ॉर्म नेविगेशन',
      home: 'होम अवलोकन',
      dashboard: 'इंटरैक्टिव डैशबोर्ड',
      problem: 'समस्या विवरण एवं विश्लेषण',
      progress: 'इंजीनियरिंग रोडमैप',
      launch: 'सीटीएमएस शुरू करें',
      complianceTitle: 'मानक संरेखण',
      c1: 'आयुष-जीसीपी दिशानिर्देश',
      c2: 'शिड्यूल वाई / एनडीसीटीआर 2019',
      c3: 'यूएस एफडीए 21 सीएफआर पार्ट 11',
      c4: 'सीडीआईएससी एसडीएम डेटा संरचना',
      hackathonTitle: 'हैकथॉन पहल',
      h1: 'स्मार्ट इंडिया हैकथॉन 2026',
      h2: 'आयुष मंत्रालय, भारत सरकार',
      h3: 'फेज 1 प्रोटोटाइप उत्पाद',
      copyright: '© 2026 सूत्रमाइंड सीटीएमएस। स्मार्ट इंडिया हैकथॉन 2026 हेतु निर्मित।',
      disclaimer: 'नैदानिक अनुसंधान, शैक्षिक मूल्यांकन एवं तकनीकी प्रदर्शन हेतु।',
    },
  }[lang];

  return (
    <footer className="saas-footer">
      <div className="saas-container">
        <div className="saas-footer-grid">
          <div className="saas-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/brand/sutramind-logo.png" alt="SutraMind Logo" className="saas-brand-logo" />
              <h4 style={{ margin: 0 }}>SutraMind CTMS</h4>
            </div>
            <p>{t.brandDesc}</p>
          </div>

          <div className="saas-footer-col">
            <h5>{t.pagesTitle}</h5>
            <ul className="saas-footer-links">
              <li><button onClick={() => onNavigate('home')}>{t.home}</button></li>
              <li><button onClick={() => onNavigate('dashboard')}>{t.dashboard}</button></li>
              <li><button onClick={() => onNavigate('problem')}>{t.problem}</button></li>
              <li><button onClick={() => onNavigate('progress')}>{t.progress}</button></li>
              <li>
                <button onClick={onLaunchApp} style={{ color: 'var(--saas-gold-light)', fontWeight: 700 }}>
                  → {t.launch}
                </button>
              </li>
            </ul>
          </div>

          <div className="saas-footer-col">
            <h5>{t.complianceTitle}</h5>
            <ul className="saas-footer-links">
              <li><span>{t.c1}</span></li>
              <li><span>{t.c2}</span></li>
              <li><span>{t.c3}</span></li>
              <li><span>{t.c4}</span></li>
            </ul>
          </div>

          <div className="saas-footer-col">
            <h5>{t.hackathonTitle}</h5>
            <ul className="saas-footer-links">
              <li><span>{t.h1}</span></li>
              <li><span>{t.h2}</span></li>
              <li><span>{t.h3}</span></li>
            </ul>
          </div>
        </div>

        <div className="saas-footer-bottom">
          <div>{t.copyright}</div>
          <div>{t.disclaimer}</div>
        </div>
      </div>
    </footer>
  );
};
