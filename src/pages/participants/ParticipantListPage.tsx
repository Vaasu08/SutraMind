import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { PageHeader, DataTable, SafetyStatusBadge, ParticipantStatusBadge, LoadingState } from '../../components/ui';
import { participantService } from '../../services';
import type { Participant } from '../../types/domain';

export function ParticipantListPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filtered, setFiltered] = useState<Participant[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    participantService.getByTrial(trialId || 'trial-001').then(ps => {
      setParticipants(ps); setFiltered(ps); setLoading(false);
    });
  }, [trialId]);

  useEffect(() => {
    if (!query.trim()) { setFiltered(participants); return; }
    const q = query.toLowerCase();
    setFiltered(participants.filter(p =>
      p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) ||
      (p.prakriti || '').toLowerCase().includes(q)
    ));
  }, [query, participants]);

  const columns = [
    { key: 'id', header: 'ID', render: (r: Participant) => <strong style={{ color: 'var(--surta-green-700)' }}>{r.id}</strong>, width: '80px' },
    { key: 'name', header: 'Name', render: (r: Participant) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: 'status', header: 'Status', render: (r: Participant) => <ParticipantStatusBadge status={r.status} /> },
    { key: 'age', header: 'Age', render: (r: Participant) => `${r.age} / ${r.sex}` },
    { key: 'prakriti', header: 'Prakriti', render: (r: Participant) => {
      const d = r.dominantDosha;
      if (!d) return <span style={{ color: 'var(--status-neutral)' }}>—</span>;
      return <span className={`badge badge-${d.toLowerCase() as 'vata' | 'pitta' | 'kapha'}`}>{r.prakriti}</span>;
    }},
    { key: 'arm', header: 'Arm', render: (r: Participant) => <span style={{ fontSize: '0.8125rem' }}>{r.arm}</span> },
    { key: 'lastVisit', header: 'Last Visit', render: (r: Participant) => (
      <span style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>
        {r.lastVisitNumber > 0 ? `Visit ${r.lastVisitNumber}` : '—'}
        {r.lastVisitDate ? ` · ${r.lastVisitDate}` : ''}
      </span>
    )},
    { key: 'safety', header: 'Safety', render: (r: Participant) => <SafetyStatusBadge status={r.safetyStatus} /> },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Participants' }]}
        title="Participants"
        subtitle={`${participants.length} participants enrolled`}
        actions={<button className="btn-primary" onClick={() => navigate(`/trials/${trialId}/participants/new`)}><Plus size={16} /> Add Participant</button>}
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Enrolled', value: participants.filter(p => p.status === 'Enrolled' || p.status === 'Active').length, color: 'var(--status-good)' },
          { label: 'Treatment Arm', value: participants.filter(p => p.arm === 'Treatment').length, color: 'var(--surta-green-700)' },
          { label: 'Control Arm', value: participants.filter(p => p.arm === 'Control').length, color: 'var(--status-neutral)' },
          { label: 'With AE', value: participants.filter(p => p.safetyStatus !== 'Normal').length, color: 'var(--status-critical)' },
        ].map(s => (
          <div key={s.label} className="surta-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--status-neutral)' }} />
        <input className="form-input" placeholder="Search by ID, name, or Prakriti..." value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 36 }} />
      </div>

      <div className="surta-card" style={{ overflow: 'hidden' }}>
        {loading ? <LoadingState /> : (
          <DataTable
            columns={columns}
            data={filtered as Record<string, unknown>[]}
            onRowClick={row => navigate(`/trials/${trialId}/participants/${(row as Participant).id}`)}
          />
        )}
      </div>
    </div>
  );
}
