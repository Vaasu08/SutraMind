import React, { useState } from 'react';
import { ExternalLink, Globe, Menu, X } from 'lucide-react';

interface SaasHeaderProps {
  activePage: 'home' | 'dashboard' | 'problem' | 'progress';
  onNavigate: (page: 'home' | 'dashboard' | 'problem' | 'progress') => void;
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  isAuthenticated: boolean;
}

export const SaasHeader: React.FC<SaasHeaderProps> = ({
  activePage,
  onNavigate,
  onLaunchApp,
  lang,
  onToggleLang,
  isAuthenticated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    en: {
      brand: 'SutraMind',
      tag: 'Ayurveda CTMS',
      home: 'Home',
      dashboard: 'Live Dashboard',
      problem: 'Problem Statement',
      progress: 'Roadmap & Progress',
      launchApp: isAuthenticated ? 'Open Clinical App' : 'Launch CTMS Platform',
    },
    hi: {
      brand: 'सूत्रमाइंड',
      tag: 'आयुर्वेद सीटीएमएस',
      home: 'होम',
      dashboard: 'लाइव डैशबोर्ड',
      problem: 'समस्या विवरण (PS)',
      progress: 'प्रगति एवं रोडमैप',
      launchApp: isAuthenticated ? 'क्लिनिकल ऐप खोलें' : 'सीटीएमएस शुरू करें',
    },
  }[lang];

  const handleNav = (page: 'home' | 'dashboard' | 'problem' | 'progress') => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="saas-header">
      <div className="saas-container">
        <div className="saas-header-inner">
          <div className="saas-brand" onClick={() => handleNav('home')}>
            <img src="/brand/sutramind-logo.png" alt="SutraMind Logo" className="saas-brand-logo" />
            <div>
              <span className="saas-brand-title">
                {t.brand}
                <span className="saas-brand-tag">{t.tag}</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="saas-nav">
            <button
              className={`saas-nav-link ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => handleNav('home')}
            >
              {t.home}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNav('dashboard')}
            >
              {t.dashboard}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'problem' ? 'active' : ''}`}
              onClick={() => handleNav('problem')}
            >
              {t.problem}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'progress' ? 'active' : ''}`}
              onClick={() => handleNav('progress')}
            >
              {t.progress}
            </button>
          </nav>

          <div className="saas-header-actions">
            <button
              className="saas-lang-btn"
              onClick={onToggleLang}
              title="Toggle Language / भाषा बदलें"
            >
              <Globe size={15} />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              className="saas-btn-primary"
              onClick={onLaunchApp}
              title="Launch CTMS Clinical Workbench"
            >
              <span>{t.launchApp}</span>
              <ExternalLink size={14} />
            </button>

            {/* Mobile menu trigger */}
            <button
              className="saas-lang-btn"
              style={{ display: 'none' }} // shown via media queries if needed
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
