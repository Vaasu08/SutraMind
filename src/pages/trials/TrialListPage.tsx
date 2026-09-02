import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { PageHeader, SectionHeading, DataTable, ProgressBar, LoadingState } from '../../components/ui';
import { trialService, intelligenceService } from '../../services';
import type { Trial, TrialHealthScore } from '../../types/domain';

export function TrialListPage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [healthMap, setHealthMap] = useState<Record<string, TrialHealthScore>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const ts = await trialService.getAll();
      setTrials(ts);
      const hm: Record<string, TrialHealthScore> = {};
      for (const t of ts) hm[t.id] = await intelligenceService.getTrialHealth(t.id);
      setHealthMap(hm);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Trials"
        subtitle="All clinical trials in your portfolio"
        actions={<button className="btn-primary" onClick={() => navigate('/trials/new')}><Plus size={16} /> New Trial</button>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {trials.map(t => {
          const h = healthMap[t.id];
          const pct = Math.round((t.currentEnrollment / t.targetEnrollment) * 100);
          return (
            <div key={t.id} className="surta-card" style={{ padding: '20px 24px', cursor: 'pointer' }} onClick={() => navigate(`/trials/${t.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-500)' }}>{t.trialId}</span>
                    <span className={`badge badge-${t.status === 'ACTIVE' ? 'good' : 'neutral'}`}>{t.status}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>{t.phase} · {t.studyType}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--surta-green-900)', marginBottom: 6 }}>{t.shortTitle}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>PI: {t.principalInvestigator} · {t.condition}</div>
                </div>
                <div style={{ width: 180 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--status-neutral)' }}>Enrollment</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.currentEnrollment}/{t.targetEnrollment}</span>
                  </div>
                  <ProgressBar value={pct} showLabel={false} height={6} />
                </div>
                {h && (
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: h.overall >= 80 ? 'var(--status-good)' : h.overall >= 65 ? '#996e00' : 'var(--status-critical)' }}>{h.overall}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--status-neutral)' }}>Health Score</div>
                  </div>
                )}
                <ChevronRight size={18} style={{ color: 'var(--status-neutral)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
