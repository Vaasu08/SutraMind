import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/domain';
import { FlaskConical, ClipboardCheck, Shield, Users, ChevronRight, Brain, Activity } from 'lucide-react';

const ROLES: Array<{
  role: UserRole;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  textColor: string;
}> = [
  {
    role: 'PI',
    name: 'Dr. Priya Sharma',
    title: 'Principal Investigator',
    description: 'Full platform access — trial management, intelligence, analytics & FHIR export',
    icon: <FlaskConical size={18} strokeWidth={1.75} />,
    accentColor: 'rgba(181,138,42,0.12)',
    textColor: '#9A7523',
  },
  {
    role: 'Coordinator',
    name: 'Rahul Mehta',
    title: 'Research Coordinator',
    description: 'Participant management, visit recording, CRF completion, AE reporting',
    icon: <Users size={18} strokeWidth={1.75} />,
    accentColor: 'rgba(93,140,99,0.12)',
    textColor: '#3D7A4F',
  },
  {
    role: 'Ethics',
    name: 'Dr. Anjali Rao',
    title: 'Ethics Committee',
    description: 'Protocol review, ethics approval & rejection, safety oversight',
    icon: <ClipboardCheck size={18} strokeWidth={1.75} />,
    accentColor: 'rgba(140,163,196,0.15)',
    textColor: '#4A6688',
  },
  {
    role: 'Safety',
    name: 'Vikram Singh',
    title: 'Safety Officer',
    description: 'Adverse event monitoring, SAE review, compliance & regulatory oversight',
    icon: <Shield size={18} strokeWidth={1.75} />,
    accentColor: 'rgba(155,62,42,0.1)',
    textColor: '#9B3E2A',
  },
];

const CAPABILITIES = [
  {
    icon: <FlaskConical size={20} strokeWidth={1.5} />,
    title: 'Trial Management',
    desc: 'End-to-end protocol management, ethics workflow, milestone tracking',
  },
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: 'Participant Intelligence',
    desc: 'Prakriti assessment, visit scheduling, CRF completion, dosha profiling',
  },
  {
    icon: <Shield size={20} strokeWidth={1.5} />,
    title: 'Safety & Compliance',
    desc: 'AE/SAE monitoring, regulatory compliance, audit trail, FHIR export',
  },
  {
    icon: <Brain size={20} strokeWidth={1.5} />,
    title: 'Research Insights',
    desc: 'AI-powered clinical intelligence, analytics and actionable alerts',
  },
];

// Botanical left side SVG
function LeftBotanical() {
  return (
    <svg
      viewBox="0 0 240 500"
      style={{
        position: 'absolute', left: -30, bottom: 0,
        width: 240, height: 500,
        opacity: 0.07, pointerEvents: 'none', zIndex: 0,
      }}
      fill="none" stroke="var(--sm-forest)" strokeWidth="1.2"
    >
      <path d="M120 490 Q116 370 125 260 Q130 180 120 80" />
      <path d="M122 400 Q80 370 52 330 Q33 307 25 270" />
      <path d="M122 340 Q75 310 44 265 Q24 240 18 200" />
      <path d="M122 280 Q78 252 50 210 Q32 187 28 148" />
      <path d="M122 220 Q82 196 60 158 Q44 134 42 96" />
      <path d="M122 380 Q165 350 192 312 Q210 288 215 252" />
      <path d="M122 320 Q168 290 197 250 Q216 225 218 188" />
      <path d="M122 260 Q170 230 200 190 Q219 165 220 128" />
      <circle cx="25"  cy="270" r="3" />
      <circle cx="18"  cy="200" r="3" />
      <circle cx="215" cy="252" r="3" />
      <circle cx="218" cy="188" r="3" />
      <circle cx="220" cy="128" r="3" />
    </svg>
  );
}

// Botanical right side SVG (right panel)
function RightBotanical() {
  return (
    <svg
      viewBox="0 0 200 400"
      style={{
        position: 'absolute', right: -20, top: 20,
        width: 200, height: 400,
        opacity: 0.06, pointerEvents: 'none', zIndex: 0,
      }}
      fill="none" stroke="var(--sm-forest)" strokeWidth="1"
    >
      <path d="M100 380 Q96 280 105 190 Q110 130 100 50" />
      <path d="M102 300 Q70 278 48 248 Q32 228 26 200" />
      <path d="M102 250 Q64 226 38 192 Q22 170 17 140" />
      <path d="M102 280 Q135 258 158 228 Q174 207 178 178" />
      <path d="M102 230 Q137 208 162 176 Q178 155 180 124" />
      <circle cx="26"  cy="200" r="2.5" />
      <circle cx="17"  cy="140" r="2.5" />
      <circle cx="178" cy="178" r="2.5" />
    </svg>
  );
}

// Small decorative leaf motif
function LeafMotif({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--sm-gold)" strokeWidth="1.5">
      <path d="M12 22C12 22 4 16 4 8C4 4.134 7.582 2 12 2C16.418 2 20 4.134 20 8C20 16 12 22 12 22Z" />
      <path d="M12 2V22" strokeDasharray="2 3" />
    </svg>
  );
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--sm-ivory)' }}>

      {/* ═══ LEFT PANEL — Brand / Welcome ═══ */}
      <div style={{
        flex: '0 0 55%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px 64px',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid var(--border-color)',
      }}>
        <LeftBotanical />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          {/* Logo */}
          <div style={{ marginBottom: 44 }}>
            <img
              src="/surtamind-logo.jpg"
              alt="SURTAMIND"
              style={{
                height: 44,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Eyebrow */}
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Smart Clinical Trial Management for Ayurveda
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.75rem',
            fontWeight: 400,
            color: 'var(--sm-forest)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 20px',
          }}>
            Clinical trials,<br />
            <span style={{ color: 'var(--sm-leaf)' }}>guided by wisdom.</span>
          </h1>

          {/* Body copy */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--sm-text-soft)',
            lineHeight: 1.75,
            margin: '0 0 48px',
            maxWidth: 460,
          }}>
            A modern clinical research platform bringing structured trial management, participant tracking, safety oversight, compliance and intelligent insights together for Ayurveda research.
          </p>

          {/* Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
            {CAPABILITIES.map(cap => (
              <div key={cap.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'var(--sm-botanical-x)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--sm-leaf)', flexShrink: 0,
                  border: '1px solid var(--border-color)',
                }}>
                  {cap.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--sm-text)', marginBottom: 3, lineHeight: 1.3 }}>
                    {cap.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--sm-text-soft)', lineHeight: 1.5 }}>
                    {cap.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
            <LeafMotif size={14} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--sm-text-muted)', letterSpacing: '0.03em' }}>
              SURTAMIND · SIH 2026 · Prototype · Fictional clinical data
            </span>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Login ═══ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
        background: 'var(--sm-ivory-sage)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <RightBotanical />

        <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
          {/* Panel header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--sm-gold)', opacity: 0.35 }} />
              <LeafMotif size={12} />
              <div style={{ flex: 1, height: 1, background: 'var(--sm-gold)', opacity: 0.35 }} />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400,
              color: 'var(--sm-forest)', textAlign: 'center', margin: '0 0 6px',
            }}>
              Enter Research Workspace
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--sm-text-muted)',
              textAlign: 'center', margin: 0,
            }}>
              Select your role to continue
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROLES.map(r => (
              <button
                key={r.role}
                onClick={() => handleLogin(r.role)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--sm-white)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all var(--transition-base)',
                  boxShadow: 'none',
                }}
                onMouseEnter={e => {
                  const btn = e.currentTarget;
                  btn.style.borderColor = r.textColor;
                  btn.style.background = 'white';
                  btn.style.transform = 'translateY(-1px)';
                  btn.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget;
                  btn.style.borderColor = 'var(--border-color)';
                  btn.style.background = 'var(--sm-white)';
                  btn.style.transform = 'none';
                  btn.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-md)',
                  background: r.accentColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: r.textColor, flexShrink: 0,
                  border: `1px solid ${r.textColor}22`,
                }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--sm-text)', marginBottom: 2, lineHeight: 1.3 }}>
                    {r.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--sm-text-muted)' }}>
                    {r.name}
                  </div>
                </div>
                <ChevronRight size={15} style={{ color: 'var(--sm-text-muted)', flexShrink: 0 }} />
              </button>
            ))}
          </div>

          {/* Platform stats strip */}
          <div style={{
            marginTop: 24,
            padding: '14px 16px',
            background: 'rgba(221,233,215,0.5)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex', gap: 0,
          }}>
            {[
              { icon: <Activity size={13} />, label: 'Active Trials', value: '3' },
              { icon: <Users size={13} />, label: 'Participants', value: '184' },
              { icon: <Shield size={13} />, label: 'Safety Events', value: '7' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border-color)' : 'none', padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--sm-leaf)', marginBottom: 3 }}>
                  {stat.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1rem', color: 'var(--sm-forest)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--sm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
