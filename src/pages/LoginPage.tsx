import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/domain';
import { Leaf, FlaskConical, ClipboardCheck, Shield, Users } from 'lucide-react';

const ROLES: Array<{
  role: UserRole;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    role: 'PI',
    name: 'Dr. Priya Sharma',
    title: 'Principal Investigator',
    description: 'Full access — trial management, intelligence, analytics, FHIR export',
    icon: <FlaskConical size={22} />,
    color: 'var(--surta-gold)',
  },
  {
    role: 'Coordinator',
    name: 'Rahul Mehta',
    title: 'Research Coordinator',
    description: 'Participant management, visit recording, CRF completion, AE reporting',
    icon: <Users size={22} />,
    color: 'var(--surta-green-500)',
  },
  {
    role: 'Ethics',
    name: 'Dr. Anjali Rao',
    title: 'Ethics Committee',
    description: 'Protocol review, ethics approval/rejection, safety visibility',
    icon: <ClipboardCheck size={22} />,
    color: '#8CA3C4',
  },
  {
    role: 'Safety',
    name: 'Vikram Singh',
    title: 'Safety Officer',
    description: 'Adverse event monitoring, SAE review, compliance & regulatory oversight',
    icon: <Shield size={22} />,
    color: 'var(--status-critical)',
  },
];

// Botanical SVG line-art (fern/leaf)
function BotanicalArt() {
  return (
    <svg
      viewBox="0 0 400 600"
      style={{ position: 'absolute', right: -40, top: -60, width: 440, height: 640, opacity: 0.08, pointerEvents: 'none' }}
      fill="none"
      stroke="white"
      strokeWidth="1.2"
    >
      {/* Main stem */}
      <path d="M200 580 Q195 400 210 200 Q215 100 200 20" />
      {/* Left fronds */}
      <path d="M205 480 Q160 440 120 400 Q100 375 90 340" />
      <path d="M207 420 Q150 380 100 330 Q75 300 60 260" />
      <path d="M208 360 Q155 320 115 275 Q90 245 80 200" />
      <path d="M209 300 Q160 265 130 225 Q110 195 105 155" />
      <path d="M210 240 Q170 210 150 175 Q135 145 132 110" />
      <path d="M211 180 Q175 155 160 125 Q148 98 148 65" />
      {/* Right fronds */}
      <path d="M205 460 Q255 420 290 375 Q310 348 318 310" />
      <path d="M206 400 Q262 360 305 310 Q325 280 330 240" />
      <path d="M207 340 Q265 300 310 255 Q332 225 338 185" />
      <path d="M208 280 Q268 245 315 200 Q338 170 344 130" />
      <path d="M209 220 Q272 190 318 150 Q340 122 345 85" />
      {/* Leaflets on left fronds */}
      <path d="M163 432 Q150 415 140 398" />
      <path d="M145 378 Q132 360 122 342" />
      <path d="M120 320 Q108 300 100 282" />
      <path d="M168 230 Q156 208 150 188" />
      {/* Leaflets on right fronds */}
      <path d="M247 445 Q263 427 272 410" />
      <path d="M278 388 Q294 370 304 352" />
      <path d="M308 323 Q324 304 332 286" />
      <path d="M272 238 Q288 216 296 197" />
      {/* Small circles at branch tips */}
      <circle cx="90" cy="340" r="3" />
      <circle cx="60" cy="260" r="3" />
      <circle cx="80" cy="200" r="3" />
      <circle cx="318" cy="310" r="3" />
      <circle cx="330" cy="240" r="3" />
      <circle cx="344" cy="130" r="3" />
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surta-green-900)' }}>

      {/* ── HERO BAND ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <BotanicalArt />

        {/* Left — branding */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 64px', position: 'relative', zIndex: 1,
          maxWidth: 580,
        }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surta-green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={26} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                SURTA<span style={{ color: 'var(--surta-green-500)' }}>MIND</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
                Smart CTMS for Ayurveda
              </div>
            </div>
          </div>

          {/* Hero headline */}
          <h1 style={{
            margin: '0 0 20px', fontFamily: 'var(--font-heading)', fontSize: '3rem',
            fontWeight: 600, color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em',
          }}>
            Clinical trials,<br />
            <span style={{ color: 'var(--surta-green-500)' }}>guided by wisdom.</span>
          </h1>

          <p style={{ margin: '0 0 32px', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 440 }}>
            SURTAMIND is an Ayurveda-native Clinical Trial Management System — from Prakriti assessment to FHIR export, with a built-in Intelligence Layer that turns data into action.
          </p>

          {/* Process strip */}
          <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {['Enroll', 'Assess Prakriti', 'Record Visit', 'Generate Insight'].map((step, i, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(201,162,39,0.2)', border: '1.5px solid var(--surta-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem',
                    color: 'var(--surta-gold)', margin: '0 auto 6px',
                  }}>{i + 1}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{step}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 32, height: 1, background: 'rgba(201,162,39,0.3)', margin: '0 6px', marginBottom: 22 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — login card */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 48px', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)',
            borderRadius: 20, padding: '36px 36px',
            width: '100%', maxWidth: 440,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.8)',
          }}>
            {/* Card header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--surta-gold)', opacity: 0.4 }} />
                <Leaf size={14} style={{ color: 'var(--surta-gold)' }} />
                <div style={{ flex: 1, height: 1, background: 'var(--surta-gold)', opacity: 0.4 }} />
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.375rem', color: 'var(--surta-green-900)', fontWeight: 600 }}>
                SIH Demo Access
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: 'var(--status-neutral)' }}>
                Select your role to enter the prototype
              </p>
            </div>

            {/* Role cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ROLES.map(r => (
                <button
                  key={r.role}
                  onClick={() => handleLogin(r.role)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', border: '1.5px solid var(--surta-green-100)',
                    borderRadius: 12, background: 'var(--surta-ivory)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = r.color;
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--surta-green-100)';
                    e.currentTarget.style.background = 'var(--surta-ivory)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${r.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: r.color, flexShrink: 0,
                  }}>
                    {r.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-900)', marginBottom: 1 }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', fontWeight: 400 }}>
                      {r.name}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: r.color, fontWeight: 600 }}>
                    Enter →
                  </div>
                </button>
              ))}
            </div>

            {/* Footer note */}
            <p style={{ margin: '20px 0 0', fontSize: '0.75rem', color: 'var(--status-neutral)', textAlign: 'center', lineHeight: 1.5 }}>
              SURTAMIND prototype — SIH 2026 · Fictional clinical data only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
