import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeading, ProgressBar, LoadingState } from '../../components/ui';
import { complianceService } from '../../services';
import type { ComplianceItem } from '../../types/domain';

const STATUS_STYLE = {
  Compliant:     { color: 'var(--status-good)', bg: 'var(--surta-green-100)', icon: '✓' },
  Warning:       { color: '#996e00', bg: '#fef6d9', icon: '⚠' },
  'Non-Compliant': { color: 'var(--status-critical)', bg: '#fde8e4', icon: '✗' },
  Pending:       { color: 'var(--status-neutral)', bg: '#f3f4f6', icon: '○' },
};

export function CompliancePage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceService.getByTrial(trialId || 'trial-001').then(ci => { setItems(ci); setLoading(false); });
  }, [trialId]);

  const compliant = items.filter(i => i.status === 'Compliant').length;
  const score = items.length ? Math.round((compliant / items.length) * 100) : 0;

  const categories = [...new Set(items.map(i => i.category))];

  if (loading) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Compliance' }]}
        title="Compliance Dashboard"
        subtitle="Regulatory and protocol compliance status"
      />

      {/* Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, marginBottom: 24 }}>
        <div className="surta-card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Compliance Score</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '3.5rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: score >= 80 ? 'var(--status-good)' : score >= 60 ? '#996e00' : 'var(--status-critical)', lineHeight: 1 }}>
            {score}%
          </div>
          <div style={{ marginTop: 12 }}>
            <ProgressBar value={score} showLabel={false} height={8} variant={score < 70 ? 'critical' : score < 85 ? 'gold' : 'default'} />
          </div>
          <div style={{ marginTop: 10, fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>
            {compliant}/{items.length} requirements met
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {(['Compliant','Warning','Non-Compliant','Pending'] as const).map(s => {
            const d = STATUS_STYLE[s];
            return (
              <div key={s} className="surta-card" style={{ padding: '14px 16px', borderLeft: `4px solid ${d.color}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: d.color, marginBottom: 4 }}>{s}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: d.color }}>{items.filter(i => i.status === s).length}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items by category */}
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <SectionHeading eyebrow="Category" title={cat} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.filter(i => i.category === cat).map(item => {
              const d = STATUS_STYLE[item.status];
              return (
                <div key={item.id} className="surta-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: d.color, flexShrink: 0 }}>
                    {d.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--surta-green-900)', marginBottom: 2 }}>{item.requirement}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>
                      Owner: {item.owner}
                      {item.dueDate && <span style={{ marginLeft: 10, color: item.status === 'Warning' ? '#996e00' : item.status === 'Non-Compliant' ? 'var(--status-critical)' : 'var(--status-neutral)', fontWeight: 600 }}>Due: {item.dueDate}</span>}
                    </div>
                    {item.notes && <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: 2 }}>{item.notes}</div>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)' }}>Updated: {item.lastUpdated}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
