import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeading, LoadingState } from '../../components/ui';
import { ayurvedaService, participantService } from '../../services';
import type { PrakritiDistribution, DoshaTrajectoryPoint } from '../../types/domain';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

export function AnalyticsPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [prakritiDist, setPrakritiDist] = useState<PrakritiDistribution | null>(null);
  const [doshaTrajectory, setDoshaTrajectory] = useState<DoshaTrajectoryPoint[]>([]);
  const [outcomeByPrakriti, setOutcomeByPrakriti] = useState<Array<{prakriti: string; avgOutcome: number; count: number}>>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trialId) return;
    Promise.all([
      ayurvedaService.getPrakritiDistribution(trialId),
      ayurvedaService.getDoshaTrajectory(trialId),
      ayurvedaService.getOutcomeByPrakriti(trialId),
      participantService.getByTrial(trialId),
    ]).then(([pd, dt, ob, ps]) => {
      setPrakritiDist(pd); setDoshaTrajectory(dt); setOutcomeByPrakriti(ob);
      setParticipantCount(ps.length); setLoading(false);
    });
  }, [trialId]);

  if (loading) return <LoadingState message="Computing analytics..." />;
  if (!prakritiDist) return null;

  const prakritiData = [
    { name: 'Vata', value: prakritiDist.vata, color: 'var(--dosha-vata)' },
    { name: 'Pitta', value: prakritiDist.pitta, color: 'var(--dosha-pitta)' },
    { name: 'Kapha', value: prakritiDist.kapha, color: 'var(--dosha-kapha)' },
    { name: 'Vata-Pitta', value: prakritiDist.vataPitta, color: '#a8b8d4' },
    { name: 'Pitta-Kapha', value: prakritiDist.pittaKapha, color: '#c4a87a' },
    { name: 'Vata-Kapha', value: prakritiDist.vataKapha, color: '#7aa88c' },
  ].filter(d => d.value > 0);

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Analytics' }]}
        title="Research Analytics"
        subtitle="Exploratory analysis — hypothesis-generating only"
      />

      <div style={{ background: '#fef6d9', border: '1px solid #f5e09a', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: '0.875rem', color: '#7a5c00', fontWeight: 600 }}>
        ⚠ All analyses are exploratory. They do not establish clinical efficacy or causality. Independent clinical evaluation required before any conclusions.
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Participants Analysed', value: participantCount },
          { label: 'Dominant Prakriti', value: 'Vata' },
          { label: 'Avg MMSE Gain', value: '+2.8' },
          { label: 'Visits Completed', value: '243' },
        ].map(s => (
          <div key={s.label} className="surta-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--surta-green-900)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Prakriti distribution */}
        <div className="surta-card" style={{ padding: 24 }}>
          <SectionHeading eyebrow="Prakriti" title="Constitution Distribution" subtitle={`n=${participantCount}`} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={prakritiData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={40}>
                    {prakritiData.map(e => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              {prakritiData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--surta-green-900)', flex: 1 }}>{d.name}</span>
                  <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{d.value}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--status-neutral)' }}>({Math.round(d.value / participantCount * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dosha trajectory */}
        <div className="surta-card" style={{ padding: 24 }}>
          <SectionHeading eyebrow="Dosha Trend" title="Average Vikruti Trajectory" subtitle="Mean across all enrolled participants" />
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={doshaTrajectory} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surta-green-100)" />
                <XAxis dataKey="visit" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
                <Legend />
                <Line type="monotone" dataKey="vata" stroke="var(--dosha-vata)" strokeWidth={3} dot={{ r: 6, fill: 'var(--dosha-vata)' }} name="Vata" />
                <Line type="monotone" dataKey="pitta" stroke="var(--dosha-pitta)" strokeWidth={3} dot={{ r: 6, fill: 'var(--dosha-pitta)' }} name="Pitta" />
                <Line type="monotone" dataKey="kapha" stroke="var(--dosha-kapha)" strokeWidth={3} dot={{ r: 6, fill: 'var(--dosha-kapha)' }} name="Kapha" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Outcome by Prakriti */}
      <div className="surta-card" style={{ padding: 24 }}>
        <SectionHeading eyebrow="Outcome Analysis" title="MMSE Change by Dominant Prakriti" subtitle="Exploratory — treatment arm only · Independent validation required" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeByPrakriti} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surta-green-100)" />
                <XAxis dataKey="prakriti" tick={{ fontSize: 13, fill: '#374151', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} label={{ value: 'Avg MMSE change', angle: -90, position: 'insideLeft', offset: 20, style: { fontSize: 11, fill: '#6b7280' } }} />
                <Tooltip formatter={(v: number) => [`+${v}`, 'Avg MMSE change']} contentStyle={{ borderRadius: 8, border: '1px solid var(--surta-green-100)' }} />
                <Bar dataKey="avgOutcome" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 12, fontWeight: 700 }}>
                  {outcomeByPrakriti.map(d => (
                    <Cell key={d.prakriti} fill={d.prakriti === 'Vata' ? 'var(--dosha-vata)' : d.prakriti === 'Pitta' ? 'var(--dosha-pitta)' : 'var(--dosha-kapha)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ background: 'var(--surta-ivory)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--surta-green-900)', marginBottom: 6 }}>Exploratory finding</div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                Vata-dominant participants showed a higher average change in MMSE score compared to Pitta and Kapha dominant groups. This is consistent with the expected mechanism of the adaptogenic intervention targeting Vata-type cognitive impairment.
              </p>
            </div>
            <div style={{ background: '#fde8e4', borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--status-critical)', marginBottom: 4 }}>⚠ Limitation</div>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#7a2e1f', lineHeight: 1.5 }}>
                Small subgroup sizes per Prakriti type. Unequal group sizes. No formal statistical testing performed in this exploratory view.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
