import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FlaskConical, Calendar, Shield, AlertTriangle, Brain, ChevronRight, TrendingUp
} from 'lucide-react';
import { LoadingState } from '../components/ui';
import { trialService, participantService, safetyService, intelligenceService } from '../services';
import type { Trial, TrialHealthScore, Alert } from '../types/domain';

// ── Botanical watermark for hero area ──
function HeroBotanical() {
  return (
    <svg
      viewBox="0 0 300 300"
      style={{
        position: 'absolute', right: 0, top: -20,
        width: 280, height: 280,
        opacity: 0.055, pointerEvents: 'none', zIndex: 0,
      }}
      fill="none" stroke="var(--sm-forest)" strokeWidth="1.2"
    >
      <path d="M150 280 Q146 200 155 130 Q158 80 150 20" />
      <path d="M152 230 Q115 205 88 170 Q70 148 62 115" />
      <path d="M152 185 Q110 160 80 120 Q62 97 56 62" />
      <path d="M153 140 Q116 116 90 80  Q74 58  70 24" />
      <path d="M152 215 Q192 188 218 153 Q235 130 240 98" />
      <path d="M153 170 Q196 144 224 108 Q242 84  246 50" />
      <path d="M153 125 Q198 100 225 66  Q242 42  244 10" />
      <circle cx="62"  cy="115" r="3" />
      <circle cx="56"  cy="62"  r="3" />
      <circle cx="240" cy="98"  r="3" />
      <circle cx="246" cy="50"  r="3" />
    </svg>
  );
}

// ── Metric strip item ──
function MetricItem({
  label, value, icon, tint = '', isCritical = false, isWarning = false
}: {
  label: string; value: number | string; icon: React.ReactNode;
  tint?: string; isCritical?: boolean; isWarning?: boolean;
}) {
  return (
    <div
      className={`metric-strip-item${tint ? ' ' + tint : ''}`}
      style={{ cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="section-label" style={{ lineHeight: 1.2 }}>{label}</span>
        <span style={{ color: isCritical ? 'var(--sm-critical)' : isWarning ? 'var(--sm-gold)' : 'var(--sm-text-muted)', opacity: 0.7 }}>
          {icon}
        </span>
      </div>
      <div
        className="metric-number"
        style={{ color: isCritical ? 'var(--sm-critical)' : isWarning ? 'var(--sm-warning)' : 'var(--sm-text)' }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Enrollment indicator with milestone dots ──
function EnrollmentIndicator({ current, target }: { current: number; target: number }) {
  const pct = Math.min((current / target) * 100, 100);
  const milestones = [25, 50, 75, 100];

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--sm-text-soft)' }}>
          Enrollment
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--sm-text)', fontVariantNumeric: 'tabular-nums' }}>
          {current} <span style={{ color: 'var(--sm-text-muted)', fontWeight: 400 }}>/ {target}</span>
        </span>
      </div>
      <div className="enrollment-track">
        <div className="enrollment-bar">
          <div className="enrollment-fill" style={{ width: `${pct}%` }} />
        </div>
        {milestones.map(m => (
          <div
            key={m}
            className={`enrollment-dot${m === 25 || m === 50 || m === 75 ? '' : ' milestone'}`}
            style={{ left: `${m}%`, opacity: pct >= m ? 1 : 0.3 }}
          />
        ))}
      </div>
      <div style={{ textAlign: 'right', marginTop: 5 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--sm-leaf)', fontWeight: 600 }}>
          {Math.round(pct)}% enrolled
        </span>
      </div>
    </div>
  );
}

// ── Health score compact display ──
function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--sm-good)' : score >= 65 ? 'var(--sm-warning)' : 'var(--sm-critical)';
  const label = score >= 80 ? 'Healthy' : score >= 65 ? 'Attention' : 'Critical';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.75rem', color, fontVariantNumeric: 'tabular-nums' }}>
          {score}
        </span>
      </div>
      <div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--sm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>Health</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color }}>{label}</div>
      </div>
    </div>
  );
}

// ── Status dot indicator ──
function StatusDot({ good, label }: { good: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: good ? 'var(--sm-good)' : 'var(--sm-warning)',
        flexShrink: 0,
      }} />
      <span style={{ fontSize: '0.75rem', color: 'var(--sm-text-soft)' }}>{label}</span>
    </div>
  );
}

// ── Trial research panel ──
function TrialPanel({ trial, health, onOpen }: { trial: Trial; health: TrialHealthScore; onOpen: () => void }) {
  return (
    <div
      className="surta-card"
      style={{ padding: '22px 24px', cursor: 'pointer' }}
      onClick={onOpen}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 700,
            color: 'var(--sm-leaf)', letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 5,
          }}>
            {trial.trialId}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.0625rem',
            fontWeight: 400, color: 'var(--sm-forest)', lineHeight: 1.3, margin: 0
          }}>
            {trial.shortTitle}
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span className={`badge badge-${trial.status === 'ACTIVE' ? 'good' : trial.status === 'DRAFT' ? 'neutral' : 'dark'}`}>
            {trial.status}
          </span>
        </div>
      </div>

      {/* PI + Phase */}
      <div style={{ fontSize: '0.8125rem', color: 'var(--sm-text-muted)', marginBottom: 18 }}>
        {trial.principalInvestigator} &middot; {trial.phase}
      </div>

      {/* Enrollment */}
      <EnrollmentIndicator current={trial.currentEnrollment} target={trial.targetEnrollment} />

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)' }}>
        <HealthScore score={health.overall} />
        <div style={{ width: 1, height: 32, background: 'var(--border-color)' }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <StatusDot good={health.safety >= 80} label="Safety" />
          <StatusDot good={health.compliance >= 80} label="Compliance" />
        </div>
        <ChevronRight size={16} style={{ color: 'var(--sm-text-muted)', marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

// ── Alert panel item ──
function AlertItem({ alert, onClick }: { alert: Alert; onClick: () => void }) {
  const priorityClass = alert.priority === 'Critical' ? 'critical' : alert.priority === 'High' ? 'high' : alert.priority === 'Medium' ? 'medium' : 'low';
  const priorityColor = alert.priority === 'Critical' ? 'var(--sm-critical)' : alert.priority === 'High' ? 'var(--sm-gold)' : 'var(--sm-leaf)';

  return (
    <div className={`alert-item ${priorityClass}`} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--sm-text)', lineHeight: 1.3, marginBottom: 3 }}>
          {alert.title}
        </div>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: priorityColor, flexShrink: 0, marginTop: 2,
        }}>
          {alert.priority}
        </span>
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--sm-text-soft)', lineHeight: 1.5 }}>
        {alert.description.slice(0, 72)}{alert.description.length > 72 ? '…' : ''}
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export function DashboardPage() {
  const navigate = useNavigate();
  const [trials, setTrials] = useState<Trial[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [openAEs, setOpenAEs] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [healthMap, setHealthMap] = useState<Record<string, TrialHealthScore>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [t, p, aes, al, h] = await Promise.all([
        trialService.getAll(),
        participantService.getByTrial('trial-001'),
        safetyService.getByTrial('trial-001'),
        intelligenceService.getAlerts('trial-001'),
        intelligenceService.getTrialHealth('trial-001'),
      ]);
      setTrials(t);
      setParticipantCount(p.length);
      setOpenAEs(aes.filter(ae => ae.status !== 'Closed').length);
      setAlerts(al);
      setHealthMap({ 'trial-001': h });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading research overview…" />;

  const activeTrials = trials.filter(t => t.status === 'ACTIVE').length;
  const complianceAlerts = alerts.filter(a => a.type !== 'OVERDUE_VISIT').length;

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 1280 }}>

      {/* ── Hero header ── */}
      <div style={{ position: 'relative', marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--border-color)' }}>
        <HeroBotanical />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            AI + Ayurveda Clinical Research Platform
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '2.25rem',
            fontWeight: 400, color: 'var(--sm-forest)',
            letterSpacing: '-0.02em', lineHeight: 1.15,
            margin: '0 0 8px',
          }}>
            Research Overview
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--sm-text-soft)', margin: 0 }}>
            {activeTrials} active {activeTrials === 1 ? 'study' : 'studies'} · {participantCount} enrolled participants across the Ayurveda research portfolio
          </p>
        </div>
      </div>

      {/* ── Metric strip ── */}
      <div className="metric-strip" style={{ marginBottom: 32 }}>
        <MetricItem
          label="Active Trials"
          value={activeTrials}
          icon={<FlaskConical size={15} />}
        />
        <MetricItem
          label="Participants"
          value={participantCount}
          icon={<Users size={15} />}
          tint="tinted-sage"
        />
        <MetricItem
          label="Pending Visits"
          value={7}
          icon={<Calendar size={15} />}
          isWarning={true}
        />
        <MetricItem
          label="Open Safety Events"
          value={openAEs}
          icon={<Shield size={15} />}
          isCritical={openAEs > 3}
          tint={openAEs > 3 ? 'tinted-critical' : ''}
        />
        <MetricItem
          label="Compliance Alerts"
          value={complianceAlerts}
          icon={<AlertTriangle size={15} />}
          isWarning={complianceAlerts > 0}
        />
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28 }}>

        {/* Left — Trial portfolio */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Active Studies</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--sm-forest)', margin: 0 }}>
                Trial Portfolio
              </h2>
            </div>
            <button className="btn-primary btn-sm" onClick={() => navigate('/trials/new')}>
              + New Trial
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {trials.map(trial => (
              <TrialPanel
                key={trial.id}
                trial={trial}
                health={healthMap[trial.id] || { overall: 80, label: 'Healthy', enrollment: 80, followUp: 80, dataQuality: 80, safety: 80, compliance: 80 }}
                onOpen={() => navigate(`/trials/${trial.id}`)}
              />
            ))}
            {trials.length === 0 && (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--sm-text-muted)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                <div style={{ marginBottom: 8, fontSize: '1.5rem', opacity: 0.4 }}>⬡</div>
                <p style={{ margin: '0 0 4px', fontWeight: 500, color: 'var(--sm-text-soft)' }}>No trials registered yet.</p>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Begin by creating a new trial protocol.</p>
              </div>
            )}
          </div>

          {/* Quick enrollment insight below trials */}
          {trials.length > 0 && (
            <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--sm-ivory-sage)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <TrendingUp size={18} style={{ color: 'var(--sm-leaf)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--sm-forest)', marginBottom: 2 }}>AYU-001 at 84% enrollment</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--sm-text-soft)' }}>84 of 100 target participants enrolled. Projected completion in 6 weeks.</div>
              </div>
              <button className="btn-text btn-sm" onClick={() => navigate('/trials/trial-001')}>
                View →
              </button>
            </div>
          )}
        </div>

        {/* Right — Intelligence panel */}
        <div>
          {/* Action Required */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Clinical Intelligence</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, color: 'var(--sm-forest)', margin: 0 }}>
                  Action Required
                </h2>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--sm-critical-bg)',
                border: '1px solid rgba(155,62,42,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 700,
                color: 'var(--sm-critical)',
              }}>
                {alerts.filter(a => a.priority === 'Critical' || a.priority === 'High').length}
              </div>
            </div>

            <div style={{ background: 'var(--sm-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {alerts.length === 0 ? (
                <div style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--sm-text-muted)' }}>
                  <div style={{ fontSize: '0.875rem' }}>No active alerts. All systems nominal.</div>
                </div>
              ) : (
                alerts.slice(0, 5).map(alert => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onClick={() => navigate(alert.navigateTo)}
                  />
                ))
              )}
            </div>

            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <button
                className="btn-text"
                onClick={() => navigate('/intelligence')}
                style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Brain size={14} />
                View all intelligence
                <span style={{ color: 'var(--sm-text-muted)' }}>→</span>
              </button>
            </div>
          </div>

          {/* Quick navigation */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Quick Access</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Safety Events', icon: <Shield size={14} />, path: '/safety', badge: openAEs > 0 ? String(openAEs) : null, badgeCritical: true },
                { label: 'Compliance', icon: <AlertTriangle size={14} />, path: '/compliance', badge: complianceAlerts > 0 ? String(complianceAlerts) : null, badgeCritical: false },
                { label: 'Analytics', icon: <TrendingUp size={14} />, path: '/analytics', badge: null, badgeCritical: false },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none', background: 'transparent',
                    cursor: 'pointer', width: '100%',
                    transition: 'background var(--transition-fast)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--sm-ivory-sage)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: 'var(--sm-leaf)', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--sm-text-mid)', flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 700,
                      background: item.badgeCritical ? 'var(--sm-critical-bg)' : 'var(--sm-warning-bg)',
                      color: item.badgeCritical ? 'var(--sm-critical)' : '#7A5A18',
                      padding: '1px 7px', borderRadius: 'var(--radius-xs)',
                    }}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={13} style={{ color: 'var(--sm-text-muted)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
