import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FlaskConical, Calendar, Shield, AlertTriangle, Brain, TrendingUp, ChevronRight } from 'lucide-react';
import { SectionHeading, MetricCard, ProgressBar, StatusBadge, LoadingState } from '../components/ui';
import { trialService, participantService, safetyService, intelligenceService } from '../services';
import type { Trial, Participant, TrialHealthScore, Alert } from '../types/domain';

function TrialCard({ trial, health, onOpen }: { trial: Trial; health: TrialHealthScore; onOpen: () => void }) {
  const enrollPct = (trial.currentEnrollment / trial.targetEnrollment) * 100;

  return (
    <div className="surta-card" style={{ padding: '22px 24px', cursor: 'pointer' }} onClick={onOpen}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-500)', marginBottom: 3 }}>
            {trial.trialId}
          </div>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--surta-green-900)', lineHeight: 1.3 }}>
            {trial.shortTitle}
          </h3>
        </div>
        <span className={`badge badge-${trial.status === 'ACTIVE' ? 'good' : trial.status === 'DRAFT' ? 'neutral' : 'dark'}`}>
          {trial.status}
        </span>
      </div>

      {/* PI */}
      <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginBottom: 16 }}>
        PI: {trial.principalInvestigator} · {trial.phase}
      </div>

      {/* Enrollment */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--surta-green-700)' }}>Enrollment</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--surta-green-900)' }}>
            {trial.currentEnrollment} / {trial.targetEnrollment}
          </span>
        </div>
        <ProgressBar value={enrollPct} showLabel={false} height={8} />
      </div>

      {/* Health + Safety + Compliance */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', marginBottom: 2 }}>Trial Health</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', color: health.overall >= 80 ? 'var(--status-good)' : health.overall >= 65 ? '#996e00' : 'var(--status-critical)' }}>
            {health.overall}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--status-neutral)' }}>/100</span>
          </div>
        </div>
        <div style={{ height: 36, width: 1, background: 'var(--surta-green-100)' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--status-neutral)', marginBottom: 3 }}>Safety</div>
            <StatusBadge variant={health.safety >= 80 ? 'good' : 'warning'}>
              {health.safety >= 80 ? '✓' : '⚠'}
            </StatusBadge>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--status-neutral)', marginBottom: 3 }}>Compliance</div>
            <StatusBadge variant={health.compliance >= 80 ? 'good' : 'warning'}>
              {health.compliance >= 80 ? '✓' : '⚠'}
            </StatusBadge>
          </div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--status-neutral)', marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

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

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const criticalAlerts = alerts.filter(a => a.priority === 'Critical');
  const highAlerts = alerts.filter(a => a.priority === 'High');

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--status-neutral)' }}>
          AIIA Ayurveda Clinical Research Platform
        </p>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--surta-green-900)' }}>
          Research Overview
        </h1>
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
        <MetricCard label="Active Trials" value={trials.filter(t => t.status === 'ACTIVE').length} icon={<FlaskConical size={20} />} />
        <MetricCard label="Participants" value={participantCount} icon={<Users size={20} />} />
        <MetricCard label="Pending Visits" value={7} subtext="Overdue" icon={<Calendar size={20} />} variant="warning" />
        <MetricCard label="Open Safety Events" value={openAEs} icon={<Shield size={20} />} variant={openAEs > 3 ? 'critical' : 'default'} />
        <MetricCard label="Compliance Alerts" value={alerts.filter(a => a.type !== 'OVERDUE_VISIT').length} icon={<AlertTriangle size={20} />} variant="warning" />
      </div>

      {/* Alerts banner (if any critical) */}
      {criticalAlerts.length > 0 && (
        <div style={{
          background: '#fde8e4', border: '1px solid #f5c2ba', borderRadius: 12,
          padding: '16px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Shield size={20} style={{ color: 'var(--status-critical)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, color: 'var(--status-critical)', marginRight: 8 }}>
              {criticalAlerts.length} critical {criticalAlerts.length === 1 ? 'action' : 'actions'} required
            </span>
            <span style={{ fontSize: '0.875rem', color: '#7a2e1f' }}>
              {criticalAlerts.map(a => a.title).join(' · ')}
            </span>
          </div>
          <button className="btn-danger btn-sm" onClick={() => navigate('/trials/trial-001/intelligence')}>
            <Brain size={14} /> View Intelligence
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Trial cards */}
        <div>
          <SectionHeading
            eyebrow="Active Studies"
            title="Trial Portfolio"
            action={<button className="btn-primary btn-sm" onClick={() => navigate('/trials/new')}>+ New Trial</button>}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trials.map(trial => (
              <TrialCard
                key={trial.id}
                trial={trial}
                health={healthMap[trial.id] || { overall: 80, label: 'Healthy', enrollment: 80, followUp: 80, dataQuality: 80, safety: 80, compliance: 80 }}
                onOpen={() => navigate(`/trials/${trial.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Action panel */}
        <div>
          <SectionHeading eyebrow="Intelligence" title="Action Required" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => navigate(alert.navigateTo)}
                className="surta-card"
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  borderLeft: `4px solid ${alert.priority === 'Critical' ? 'var(--status-critical)' : alert.priority === 'High' ? 'var(--status-warning)' : alert.priority === 'Medium' ? 'var(--status-neutral)' : 'var(--surta-green-500)'}`,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--surta-green-900)', marginBottom: 3 }}>{alert.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>{alert.description.slice(0, 80)}...</div>
                <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--surta-green-500)', fontWeight: 600 }}>
                  {alert.priority} · View →
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="surta-card" style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--status-neutral)', fontSize: '0.875rem' }}>
                ✓ No active alerts
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div style={{ marginTop: 20 }}>
            <SectionHeading eyebrow="Trends" title="Quick Insights" />
            <div className="surta-card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <TrendingUp size={16} style={{ color: 'var(--surta-green-500)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--surta-green-900)' }}>AYU-001 Enrollment</span>
              </div>
              <ProgressBar value={84} max={100} showLabel height={10} />
              <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginTop: 8 }}>84 of 100 target participants enrolled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
