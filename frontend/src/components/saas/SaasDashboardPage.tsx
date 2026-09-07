import React, { useState } from 'react';
import {
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  CalendarCheck,
  Pill,
  AlertCircle,
  ArrowRight,
  Search,
} from 'lucide-react';

interface SaasDashboardPageProps {
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
}

export const SaasDashboardPage: React.FC<SaasDashboardPageProps> = ({ onLaunchApp, lang }) => {
  const [selectedStudy, setSelectedStudy] = useState<'amavata' | 'pratishyaya'>('amavata');
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    en: {
      badge: 'Live Clinical Intelligence',
      title: 'Ayurveda Trial Analytics & Research KPIs',
      desc: 'Real-time multi-dimensional view of clinical trial recruitment, doshic constitution distribution, medication adherence, and query resolution metrics.',
      studySelect: 'Select Clinical Trial:',
      studies: {
        amavata: {
          code: 'AMAVATA-001',
          name: 'Yogaraja Guggulu in Amavata (Rheumatoid Arthritis)',
          phase: 'Phase II Clinical Trial',
          institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
          ctri: 'CTRI/2026/08/045210',
          sampleTarget: 120,
          enrolled: 68,
          completedVisits: 142,
          scheduledVisits: 154,
          adherencePct: 98.6,
          ethicsStatus: 'APPROVED',
          iecNumber: 'AIIA-IEC-2026-001',
          openQueries: 1,
          answeredQueries: 3,
          closedQueries: 14,
        },
        pratishyaya: {
          code: 'PRATISHYAYA-001',
          name: 'Haridra Khanda in Pratishyaya (Allergic Rhinitis)',
          phase: 'Phase II Clinical Trial',
          institution: 'National Institute of Ayurveda (NIA), Jaipur',
          ctri: 'CTRI/2026/09/047890',
          sampleTarget: 60,
          enrolled: 42,
          completedVisits: 88,
          scheduledVisits: 94,
          adherencePct: 100.0,
          ethicsStatus: 'APPROVED',
          iecNumber: 'NIA-IEC-2026-04',
          openQueries: 0,
          answeredQueries: 2,
          closedQueries: 9,
        },
      },
      kpiRecruitment: 'Recruitment Progress',
      kpiVisits: 'Visit Completion Rate',
      kpiAdherence: 'Medicine Adherence',
      kpiEthics: 'Ethics (IEC) Status',
      kpiQueries: 'Open Discrepancy Queries',
      prakritiTitle: 'Prakriti (Constitution) Distribution',
      prakritiSub: 'Structured participant constitution segmentation',
      vyadhiTitle: 'Vyadhi (Diagnosis) Baseline Correlation',
      vyadhiSub: 'Classical Ayurveda diagnosis distribution',
      visitsProgressionTitle: 'Milestone Visit Progression',
      cohortTitle: 'Structured Participant Cohort Preview',
      cohortDesc: 'Demonstrating structured Ayurveda observation tokens (Prakriti, Agni, Bala, Satva) without free-text loss.',
      cohortCols: ['Subject Code', 'Age / Gender', 'Randomization ID', 'Prakriti (Constitution)', 'Agni (Digestion)', 'Bala (Strength)', 'Current Status'],
      openFullCtms: 'Launch Full Clinical CTMS Workspace',
    },
    hi: {
      badge: 'लाइव क्लिनिकल विश्लेषण',
      title: 'आयुर्वेद ट्रायल विश्लेषण एवं अनुसंधान केपीआई',
      desc: 'नैदानिक परीक्षण भर्ती, दोषीय प्रकृति वितरण, औषधि अनुपालन और विसंगति निवारण का वास्तविक समय बहु-आयामी दृष्टिकोण।',
      studySelect: 'नैदानिक परीक्षण चुनें:',
      studies: {
        amavata: {
          code: 'AMAVATA-001',
          name: 'आमवात में योगराज गुग्गुलु (रुमेटॉइड आर्थराइटिस)',
          phase: 'फेज II नैदानिक परीक्षण',
          institution: 'अखिल भारतीय आयुर्वेद संस्थान (AIIA), नई दिल्ली',
          ctri: 'CTRI/2026/08/045210',
          sampleTarget: 120,
          enrolled: 68,
          completedVisits: 142,
          scheduledVisits: 154,
          adherencePct: 98.6,
          ethicsStatus: 'स्वीकृत (APPROVED)',
          iecNumber: 'AIIA-IEC-2026-001',
          openQueries: 1,
          answeredQueries: 3,
          closedQueries: 14,
        },
        pratishyaya: {
          code: 'PRATISHYAYA-001',
          name: 'प्रतिश्याय में हरिद्रा खण्ड (एलर्जिक राइनाइटिस)',
          phase: 'फेज II नैदानिक परीक्षण',
          institution: 'राष्ट्रीय आयुर्वेद संस्थान (NIA), जयपुर',
          ctri: 'CTRI/2026/09/047890',
          sampleTarget: 60,
          enrolled: 42,
          completedVisits: 88,
          scheduledVisits: 94,
          adherencePct: 100.0,
          ethicsStatus: 'स्वीकृत (APPROVED)',
          iecNumber: 'NIA-IEC-2026-04',
          openQueries: 0,
          answeredQueries: 2,
          closedQueries: 9,
        },
      },
      kpiRecruitment: 'नामांकन प्रगति',
      kpiVisits: 'विज़िट पूर्णता दर',
      kpiAdherence: 'औषधि अनुपालन दर',
      kpiEthics: 'आचार समिति (IEC) स्थिति',
      kpiQueries: 'लंबित विसंगति प्रश्न (क्वेरी)',
      prakritiTitle: 'प्रकृति वितरण (Constitution Distribution)',
      prakritiSub: 'संरचित प्रतिभागी दोषीय प्रकृति विभाजन',
      vyadhiTitle: 'व्याधि निदान वर्गीकरण',
      vyadhiSub: 'शास्त्रीय आयुर्वेदिक निदान अनुपात',
      visitsProgressionTitle: 'विज़िट चरणबद्ध प्रगति',
      cohortTitle: 'संरचित प्रतिभागी कोहोर्ट पूर्वावलोकन',
      cohortDesc: 'बिना किसी अनस्ट्रक्चर्ड टेक्स्ट हानि के प्रकृति, अग्नि, बल, सत्व टोकन का प्रत्यक्ष प्रदर्शन।',
      cohortCols: ['प्रतिभागी कोड', 'उम्र / लिंग', 'रैंडमाइजेशन आईडी', 'प्रकृति', 'जठराग्नि', 'बल', 'वर्तमान स्थिति'],
      openFullCtms: 'पूर्ण सीटीएमएस कार्यस्थल खोलें',
    },
  }[lang];

  const study = t.studies[selectedStudy];

  // Prakriti Chart Data with Ayurvedic Color Scheme
  const prakritiData = [
    { name: 'Vata-Kapha (P6)', count: 28, color: '#0f5953' },
    { name: 'Vata-Pitta (P4)', count: 18, color: '#167a72' },
    { name: 'Pitta-Kapha (P5)', count: 14, color: '#c59b27' },
    { name: 'Tridoshaja (P7)', count: 5, color: '#093935' },
    { name: 'Pure Vata (P1)', count: 3, color: '#2b7a78' },
  ];

  // Visit Progression Data
  const visitProgressionData = [
    { stage: 'Screening', completed: study.enrolled + 12, scheduled: study.sampleTarget },
    { stage: 'Baseline (V0)', completed: study.enrolled, scheduled: study.enrolled },
    { stage: 'Visit 1 (D30)', completed: Math.round(study.enrolled * 0.92), scheduled: study.enrolled },
    { stage: 'Visit 2 (D60)', completed: Math.round(study.enrolled * 0.74), scheduled: study.enrolled },
    { stage: 'Visit 3 (D90)', completed: Math.round(study.enrolled * 0.48), scheduled: study.enrolled },
  ];

  // Sample Cohort Participants
  const sampleParticipants = [
    {
      code: 'AMV-001',
      age: 42,
      gender: 'FEMALE',
      randId: 'R-001',
      prakriti: 'P6: Vata-Kapha (वात-कफ)',
      agni: 'A2: Tikshnagni (तीक्ष्णाग्नि)',
      bala: 'B2: Madhyama (मध्यम बल)',
      satva: 'S2: Madhyama',
      status: 'Visit 2 Completed',
      statusColor: '#15803d',
    },
    {
      code: 'AMV-002',
      age: 51,
      gender: 'MALE',
      randId: 'R-002',
      prakriti: 'P4: Vata-Pitta (वात-पित्त)',
      agni: 'A3: Vishamagni (विषमाग्नि)',
      bala: 'B2: Madhyama (मध्यम बल)',
      satva: 'S1: Pravara',
      status: 'Visit 1 Completed',
      statusColor: '#15803d',
    },
    {
      code: 'AMV-003',
      age: 38,
      gender: 'FEMALE',
      randId: 'R-003',
      prakriti: 'P5: Pitta-Kapha (पित्त-कफ)',
      agni: 'A1: Samagni (समाग्नि)',
      bala: 'B1: Pravara (प्रवर बल)',
      satva: 'S1: Pravara',
      status: 'Visit 1 Completed',
      statusColor: '#15803d',
    },
    {
      code: 'AMV-004',
      age: 62,
      gender: 'MALE',
      randId: 'R-004',
      prakriti: 'P6: Vata-Kapha (वात-कफ)',
      agni: 'A4: Mandagni (मन्दाग्नि)',
      bala: 'B3: Avara (अवर बल)',
      satva: 'S3: Avara',
      status: 'Query Pending',
      statusColor: '#b45309',
    },
    {
      code: 'AMV-005',
      age: 47,
      gender: 'FEMALE',
      randId: 'R-005',
      prakriti: 'P7: Tridoshaja (त्रिदोषज)',
      agni: 'A3: Vishamagni (विषमाग्नि)',
      bala: 'B2: Madhyama (मध्यम बल)',
      satva: 'S2: Madhyama',
      status: 'Baseline Done',
      statusColor: '#0369a1',
    },
  ];

  const filteredParticipants = sampleParticipants.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.randId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prakriti.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="saas-animate-fade" style={{ padding: '48px 0 80px' }}>
      <div className="saas-container">
        {/* Header Title */}
        <div className="saas-section-header" style={{ marginBottom: '32px' }}>
          <div className="saas-pill">
            <span className="saas-pill-dot" />
            <span>{t.badge}</span>
          </div>
          <h1 className="saas-section-title" style={{ marginTop: '16px' }}>{t.title}</h1>
          <p className="saas-section-desc">{t.desc}</p>
        </div>

        {/* Study Selector Bar */}
        <div
          style={{
            background: 'var(--saas-surface)',
            borderRadius: 'var(--saas-radius-md)',
            border: '1px solid var(--saas-border)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
            boxShadow: 'var(--saas-shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--saas-primary-dark)' }}>
              {t.studySelect}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`saas-tab-btn ${selectedStudy === 'amavata' ? 'active' : ''}`}
                onClick={() => setSelectedStudy('amavata')}
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                AMAVATA-001 (AIIA New Delhi)
              </button>
              <button
                className={`saas-tab-btn ${selectedStudy === 'pratishyaya' ? 'active' : ''}`}
                onClick={() => setSelectedStudy('pratishyaya')}
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                PRATISHYAYA-001 (NIA Jaipur)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--saas-text-muted)' }}>
              CTRI: <strong>{study.ctri}</strong>
            </span>
            <span className="saas-status-badge completed">● {study.ethicsStatus}</span>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="saas-metrics-bar" style={{ marginTop: '0', marginBottom: '40px' }}>
          <div className="saas-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0f5953', marginBottom: '8px' }}>
              <Users size={20} />
              <span className="saas-metric-lbl">{t.kpiRecruitment}</span>
            </div>
            <div className="saas-metric-val">
              {study.enrolled} <span style={{ fontSize: '1.2rem', color: '#8ba39e' }}>/ {study.sampleTarget}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
              {Math.round((study.enrolled / study.sampleTarget) * 100)}% of target recruited
            </div>
          </div>

          <div className="saas-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0f5953', marginBottom: '8px' }}>
              <CalendarCheck size={20} />
              <span className="saas-metric-lbl">{t.kpiVisits}</span>
            </div>
            <div className="saas-metric-val">
              {Math.round((study.completedVisits / study.scheduledVisits) * 100)}%
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>
              {study.completedVisits} of {study.scheduledVisits} visits completed
            </div>
          </div>

          <div className="saas-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#c59b27', marginBottom: '8px' }}>
              <Pill size={20} />
              <span className="saas-metric-lbl">{t.kpiAdherence}</span>
            </div>
            <div className="saas-metric-val">{study.adherencePct}%</div>
            <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
              Verified via locked eCRFs
            </div>
          </div>

          <div className="saas-metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#b45309', marginBottom: '8px' }}>
              <AlertCircle size={20} />
              <span className="saas-metric-lbl">{t.kpiQueries}</span>
            </div>
            <div className="saas-metric-val">{study.openQueries}</div>
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>
              {study.answeredQueries} answered • {study.closedQueries} closed
            </div>
          </div>
        </div>

        {/* Recharts Data Visualizations */}
        <div className="saas-grid-2" style={{ marginBottom: '40px' }}>
          {/* Prakriti Breakdown */}
          <div className="saas-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--saas-primary-dark)', marginBottom: '4px' }}>
              {t.prakritiTitle}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--saas-text-muted)', marginBottom: '20px' }}>
              {t.prakritiSub}
            </p>
            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prakritiData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={110} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(val) => [`${val} participants`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {prakritiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visit Progression */}
          <div className="saas-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--saas-primary-dark)', marginBottom: '4px' }}>
              {t.visitsProgressionTitle}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--saas-text-muted)', marginBottom: '20px' }}>
              Participant completion trajectory across protocol visits
            </p>
            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitProgressionData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="completed" fill="#0f5953" name="Completed Visits" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="scheduled" fill="#cbd5e1" name="Target / Scheduled" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Structured Participant Cohort Preview Table */}
        <div className="saas-card" style={{ padding: '32px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--saas-primary-dark)' }}>
                {t.cohortTitle}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--saas-text-muted)', marginTop: '4px' }}>
                {t.cohortDesc}
              </p>
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search code, randomization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--saas-radius-sm)',
                  border: '1px solid var(--saas-border)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div className="saas-table-wrapper">
            <table className="saas-table">
              <thead>
                <tr>
                  {t.cohortCols.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: 'var(--saas-primary-dark)' }}>{p.code}</td>
                    <td>{p.age} y / {p.gender}</td>
                    <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{p.randId}</code></td>
                    <td><span style={{ fontWeight: 600, color: '#0f5953' }}>{p.prakriti}</span></td>
                    <td>{p.agni}</td>
                    <td>{p.bala}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: p.statusColor,
                        }}
                      >
                        ● {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA to launch app */}
        <div style={{ textAlign: 'center', padding: '32px', background: 'var(--saas-surface)', borderRadius: 'var(--saas-radius-lg)', border: '1px solid var(--saas-border)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--saas-primary-dark)', marginBottom: '8px' }}>
            Want to conduct participant visits or test the live query engine?
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--saas-text-muted)', marginBottom: '24px' }}>
            Log in with any of the 6 pre-configured demo roles with one click.
          </p>
          <button className="saas-btn-gold" onClick={onLaunchApp}>
            <span>{t.openFullCtms}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
