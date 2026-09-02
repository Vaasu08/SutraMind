import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, AlertCircle, AlertTriangle, Clock, CheckCircle, Leaf } from 'lucide-react';
import {
  PageHeader, SectionHeading, ProgressBar, LoadingState, LeafDivider
} from '../../components/ui';
import { intelligenceService, ayurvedaService } from '../../services';
import type { Alert, TrialHealthScore, PrakritiDistribution, DoshaTrajectoryPoint } from '../../types/domain';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

const PRIORITY_META = {
  Critical: { icon: <AlertCircle size={18} />, color: 'var(--status-critical)', bg: '#fde8e4', dot: '🔴' },
  High:     { icon: <AlertTriangle size={18} />, color: '#996e00', bg: '#fef6d9', dot: '🟠' },
  Medium:   { icon: <Clock size={18} />, color: 'var(--status-neutral)', bg: '#f3f4f6', dot: '🟡' },
  Low:      { icon: <CheckCircle size={18} />, color: 'var(--status-good)', bg: 'var(--surta-green-100)', dot: '🟢' },
};

function ActionCenter({ alerts, onAlertClick }: { alerts: Alert[]; onAlertClick: (a: Alert) => void }) {
  const priorities: Alert['priority'][] = ['Critical','High','Medium','Low'];
  return (
    <div className="surta-card" style={{ padding: 24 }}>
      <SectionHeading eyebrow="Intelligence" title="Action Center" subtitle="What needs attention right now?" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {priorities.map(p => {
          const group = alerts.filter(a => a.priority === p);
          if (group.length === 0) return null;
          const meta = PRIORITY_META[p];
          return group.map(alert => (
            <div
              key={alert.id}
              onClick={() => onAlertClick(alert)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderRadius: 10, cursor: 'pointer', background: meta.bg,
                border: `1px solid ${meta.color}22`, transition: 'transform 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              <span style={{ color: meta.color, flexShrink: 0 }}>{meta.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--surta-green-900)' }}>{alert.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: 2, lineHeight: 1.4 }}>{alert.description}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: meta.color, fontWeight: 700, flexShrink: 0 }}>
                View →
              </div>
            </div>
          ));
        })}
        {alerts.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', background: 'var(--surta-green-100)', borderRadius: 10 }}>
            <CheckCircle size={24} style={{ color: 'var(--status-good)', marginBottom: 8 }} />
            <div style={{ color: 'var(--status-good)', fontWeight: 700 }}>✓ No critical data integrity issues</div>
            <div style={{ color: 'var(--status-neutral)', fontSize: '0.875rem', marginTop: 4 }}>All systems nominal</div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrialHealthPanel({ health }: { health: TrialHealthScore }) {
  const dimensions = [
    { label: 'Enrollment', value: health.enrollment },
    { label: 'Follow-up', value: health.followUp },
    { label: 'Data Quality', value: health.dataQuality },
    { label: 'Safety', value: health.safety },
    { label: 'Compliance', value: health.compliance },
  ];

  return (
    <div className="surta-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.06, fontSize: 100 }}>🌿</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading eyebrow="Health Score" title="Trial Health" subtitle="Deterministic weighted formula — fully explainable" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '4rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: health.overall >= 80 ? 'var(--status-good)' : '#996e00', lineHeight: 1 }}>
            {health.overall}
          </span>
          <span style={{ fontSize: '1.5rem', color: 'var(--status-neutral)', fontWeight: 500 }}>/100</span>
          <span className={`badge badge-${health.overall >= 80 ? 'good' : 'warning'}`} style={{ marginLeft: 6 }}>{health.label}</span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginBottom: 20, fontStyle: 'italic' }}>
          Score = 20% Enrollment + 20% Follow-up + 20% Data Quality + 20% Safety + 20% Compliance
        </div>

        {dimensions.map(d => (
          <div key={d.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--surta-green-700)' }}>{d.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--surta-green-900)' }}>{d.value}%</span>
            </div>
            <ProgressBar value={d.value} showLabel={false} height={8}
              variant={d.value < 70 ? 'critical' : d.value < 80 ? 'gold' : 'default'}
            />
          </div>
        ))}

        {/* Radar-style bar chart */}
        <div style={{ marginTop: 20, height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dimensions} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dimensions.map((d) => (
                  <Cell key={d.label} fill={d.value >= 80 ? 'var(--surta-green-500)' : d.value >= 70 ? 'var(--surta-gold)' : 'var(--status-critical)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AyurvedaResearchLens({ trialId }: { trialId: string }) {
  const [prakritiDist, setPrakritiDist] = useState<PrakritiDistribution | null>(null);
  const [doshaTrajectory, setDoshaTrajectory] = useState<DoshaTrajectoryPoint[]>([]);
  const [outcomeByPrakriti, setOutcomeByPrakriti] = useState<Array<{prakriti: string; avgOutcome: number; count: number}>>([]);

  useEffect(() => {
    Promise.all([
      ayurvedaService.getPrakritiDistribution(trialId),
      ayurvedaService.getDoshaTrajectory(trialId),
      ayurvedaService.getOutcomeByPrakriti(trialId),
    ]).then(([pd, dt, ob]) => { setPrakritiDist(pd); setDoshaTrajectory(dt); setOutcomeByPrakriti(ob); });
  }, [trialId]);

  if (!prakritiDist) return <LoadingState message="Computing Ayurveda analytics..." />;

  const prakritiData = [
    { name: 'Vata', value: prakritiDist.vata, color: 'var(--dosha-vata)' },
    { name: 'Pitta', value: prakritiDist.pitta, color: 'var(--dosha-pitta)' },
    { name: 'Kapha', value: prakritiDist.kapha, color: 'var(--dosha-kapha)' },
    { name: 'Vata-Pitta', value: prakritiDist.vataPitta, color: '#a8b8d4' },
    { name: 'Pitta-Kapha', value: prakritiDist.pittaKapha, color: '#c4a87a' },
    { name: 'Vata-Kapha', value: prakritiDist.vataKapha, color: '#7aa88c' },
  ].filter(d => d.value > 0);

  return (
    <div className="surta-card" style={{ padding: 24 }}>
      <SectionHeading eyebrow="Research Lens" title="Ayurveda Research Lens" />
      <div style={{ background: '#fef6d9', border: '1px solid #f5e09a', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.8125rem', color: '#7a5c00', fontWeight: 600 }}>
        ⚠ Exploratory Analysis — These patterns are hypothesis-generating only. They do not establish clinical efficacy or causality. All findings require independent clinical evaluation.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        {/* Prakriti distribution */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--surta-green-900)', marginBottom: 12 }}>Prakriti Distribution</h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={prakritiData} dataKey="value" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} ${value}`} labelLine={false}>
                  {prakritiData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {prakritiData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--surta-green-900)', fontWeight: 500 }}>{d.name}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dosha trajectory */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--surta-green-900)', marginBottom: 4 }}>Average Dosha Trajectory</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', margin: '0 0 12px', lineHeight: 1.4 }}>
            Mean Vikruti scores across visits (all participants)
          </p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={doshaTrajectory} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surta-green-100)" />
                <XAxis dataKey="visit" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
                <Legend />
                <Line type="monotone" dataKey="vata" stroke="var(--dosha-vata)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--dosha-vata)' }} name="Vata" />
                <Line type="monotone" dataKey="pitta" stroke="var(--dosha-pitta)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--dosha-pitta)' }} name="Pitta" />
                <Line type="monotone" dataKey="kapha" stroke="var(--dosha-kapha)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--dosha-kapha)' }} name="Kapha" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome by Prakriti */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--surta-green-900)', marginBottom: 4 }}>Outcome Change by Prakriti</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', margin: '0 0 12px', lineHeight: 1.4 }}>
            Mean MMSE score change (Baseline → Latest). Treatment arm only.
          </p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeByPrakriti} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surta-green-100)" />
                <XAxis dataKey="prakriti" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip formatter={(v: number) => [`+${v}`, 'Avg MMSE change']} contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
                <Bar dataKey="avgOutcome" radius={[4, 4, 0, 0]}>
                  {outcomeByPrakriti.map((d) => (
                    <Cell key={d.prakriti} fill={d.prakriti === 'Vata' ? 'var(--dosha-vata)' : d.prakriti === 'Pitta' ? 'var(--dosha-pitta)' : 'var(--dosha-kapha)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {outcomeByPrakriti.length > 0 && (
            <div style={{ background: 'var(--surta-green-100)', borderRadius: 8, padding: '10px 12px', marginTop: 12, fontSize: '0.8125rem', color: 'var(--surta-green-700)', lineHeight: 1.5 }}>
              <strong>Exploratory finding:</strong> {outcomeByPrakriti[0]?.prakriti}-dominant participants showed a higher average change in MMSE score. This observation requires independent clinical validation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function IntelligencePage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [health, setHealth] = useState<TrialHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trialId) return;
    Promise.all([
      intelligenceService.getAlerts(trialId),
      intelligenceService.getTrialHealth(trialId),
    ]).then(([al, h]) => { setAlerts(al); setHealth(h); setLoading(false); });
  }, [trialId]);

  if (loading) return <LoadingState message="Computing intelligence..." />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Intelligence' }]}
        title="Trial Intelligence"
        subtitle="Action Center · Health Score · Ayurveda Research Lens"
        badge={<Brain size={22} style={{ color: 'var(--surta-gold)' }} />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, marginBottom: 24 }}>
        <ActionCenter alerts={alerts} onAlertClick={a => navigate(a.navigateTo)} />
        {health && <TrialHealthPanel health={health} />}
      </div>

      <LeafDivider label="Ayurveda Research Lens" />
      <AyurvedaResearchLens trialId={trialId || 'trial-001'} />
    </div>
  );
}
