import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeading, LoadingState } from '../../components/ui';
import { visitService, participantService } from '../../services';
import type { Visit, Participant } from '../../types/domain';

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  Completed: { bg: 'var(--surta-green-100)', border: 'var(--surta-green-500)', text: 'var(--status-good)' },
  Overdue:   { bg: '#fde8e4', border: 'var(--status-critical)', text: 'var(--status-critical)' },
  Due:       { bg: '#fef6d9', border: 'var(--status-warning)', text: '#7a5c00' },
  Upcoming:  { bg: 'white', border: 'var(--surta-green-100)', text: 'var(--status-neutral)' },
  Missed:    { bg: '#f3f4f6', border: '#d1d5db', text: 'var(--status-neutral)' },
};

export function VisitListPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    Promise.all([
      visitService.getByTrial(trialId || 'trial-001'),
      participantService.getByTrial(trialId || 'trial-001'),
    ]).then(([v, p]) => { setVisits(v); setParticipants(p); setLoading(false); });
  }, [trialId]);

  const filters = ['All', 'Overdue', 'Due', 'Completed', 'Upcoming'];
  const shown = filter === 'All' ? visits : visits.filter(v => v.status === filter);

  // Group by participant (show first 20 for demo)
  const participantMap = Object.fromEntries(participants.map(p => [p.id, p]));
  const displayVisits = shown.slice(0, 80);

  const counts = Object.fromEntries(filters.map(f => [f, f === 'All' ? visits.length : visits.filter(v => v.status === f).length]));

  if (loading) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Visits' }]}
        title="Visit Management"
        subtitle={`${visits.filter(v => v.status === 'Overdue').length} overdue · ${visits.filter(v => v.status === 'Due').length} due today`}
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Completed', value: counts.Completed, color: 'var(--status-good)' },
          { label: 'Due', value: counts.Due, color: '#996e00' },
          { label: 'Overdue', value: counts.Overdue, color: 'var(--status-critical)' },
          { label: 'Upcoming', value: counts.Upcoming, color: 'var(--status-neutral)' },
        ].map(s => (
          <div key={s.label} className="surta-card" style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => setFilter(s.label)}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'white', padding: '4px', borderRadius: 10, border: '1px solid var(--surta-green-100)', width: 'fit-content' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem',
            background: filter === f ? 'var(--surta-green-700)' : 'transparent',
            color: filter === f ? 'white' : 'var(--status-neutral)',
            transition: 'all 0.15s',
          }}>{f} ({counts[f]})</button>
        ))}
      </div>

      {/* Visit table */}
      <div className="surta-card" style={{ overflow: 'hidden' }}>
        <table className="surta-table">
          <thead>
            <tr>
              <th>Participant</th><th>Visit</th><th>Scheduled</th><th>Actual</th><th>Status</th><th>CRF</th>
            </tr>
          </thead>
          <tbody>
            {displayVisits.map(v => {
              const p = participantMap[v.participantId];
              const st = STATUS_STYLES[v.status] || STATUS_STYLES.Upcoming;
              return (
                <tr key={v.id} onClick={() => navigate(`/trials/${trialId}/participants/${v.participantId}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--surta-green-700)' }}>{v.participantId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)' }}>{p?.name || ''}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>Visit {v.visitNumber}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>{v.visitName}</div>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{v.scheduledDate}</td>
                  <td style={{ fontSize: '0.875rem' }}>{v.actualDate || <span style={{ color: 'var(--status-neutral)' }}>—</span>}</td>
                  <td>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    {v.crfId ? <span className="badge badge-good">✓ Complete</span> : <span className="badge badge-neutral">Pending</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
