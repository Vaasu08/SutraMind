import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { PageHeader, SectionHeading, LoadingState, Modal } from '../../components/ui';
import { safetyService, participantService } from '../../services';
import { useApp } from '../../context/AppContext';
import type { AdverseEvent, Participant } from '../../types/domain';

const PRIORITY_DISPLAY = {
  Critical: { color: 'var(--status-critical)', bg: '#fde8e4', dot: '🔴' },
  High:     { color: '#996e00', bg: '#fef6d9', dot: '🟠' },
  Review:   { color: 'var(--surta-green-700)', bg: '#fef6d9', dot: '🟡' },
  Routine:  { color: 'var(--status-neutral)', bg: '#f3f4f6', dot: '🟢' },
};

export function SafetyPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [prioritized, setPrioritized] = useState<Record<string, AdverseEvent[]>>({ Critical: [], High: [], Review: [], Routine: [] });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedAE, setSelectedAE] = useState<AdverseEvent | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportForm, setReportForm] = useState({
    participantId: '', eventName: '', description: '', severity: 'Mild' as AdverseEvent['severity'],
    isSerious: false, isExpected: false, causality: 'Possible' as AdverseEvent['causality'],
    actionTaken: '', outcome: '',
  });

  useEffect(() => {
    Promise.all([
      safetyService.getPrioritized(trialId || 'trial-001'),
      participantService.getByTrial(trialId || 'trial-001'),
    ]).then(([p, ps]) => { setPrioritized(p); setParticipants(ps); setLoading(false); });
  }, [trialId]);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    await safetyService.report({
      ...reportForm,
      trialId: trialId || 'trial-001',
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Open', reviewerNotes: '', resolvedDate: null, deadlineDays: reportForm.isSerious ? 7 : null,
      priority: reportForm.isSerious ? 'Critical' : 'Routine',
    });
    showToast('success', 'Adverse event reported', reportForm.isSerious ? 'SAE — notify PI immediately' : '');
    setShowReportModal(false);
    const p = await safetyService.getPrioritized(trialId || 'trial-001');
    setPrioritized(p);
  };

  const handleReview = async (ae: AdverseEvent, status: AdverseEvent['status']) => {
    await safetyService.updateStatus(ae.id, status, 'Reviewed by Safety Officer');
    showToast('success', `Status updated to ${status}`);
    const p = await safetyService.getPrioritized(trialId || 'trial-001');
    setPrioritized(p);
    setSelectedAE(null);
  };

  const totalCount = Object.values(prioritized).reduce((s, arr) => s + arr.length, 0);

  if (loading) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Safety' }]}
        title="Safety Intelligence"
        subtitle={`${totalCount} total adverse events`}
        actions={<button className="btn-danger" onClick={() => setShowReportModal(true)}><Plus size={16} /> Report Adverse Event</button>}
      />

      {/* Priority summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {(['Critical','High','Review','Routine'] as const).map(tier => {
          const d = PRIORITY_DISPLAY[tier];
          return (
            <div key={tier} className="surta-card" style={{ padding: '16px 20px', borderLeft: `4px solid ${d.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span>{d.dot}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: d.color, textTransform: 'uppercase' }}>{tier}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: d.color }}>{prioritized[tier]?.length || 0}</div>
            </div>
          );
        })}
      </div>

      {/* Priority lanes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(['Critical','High','Review','Routine'] as const).map(tier => {
          const events = prioritized[tier] || [];
          if (events.length === 0) return null;
          const d = PRIORITY_DISPLAY[tier];
          return (
            <div key={tier}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <AlertCircle size={16} style={{ color: d.color }} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--surta-green-900)' }}>{tier}</h3>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: d.color }}>{events.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                {events.map(ae => (
                  <div key={ae.id} className="surta-card" style={{ padding: '18px 20px', cursor: 'pointer', borderLeft: `4px solid ${d.color}`, background: ae.status === 'Under Review' ? 'white' : 'white' }} onClick={() => setSelectedAE(ae)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--surta-green-700)', fontSize: '0.8125rem', marginBottom: 2 }}>
                          {ae.participantId}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--surta-green-900)' }}>{ae.eventName}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                        {ae.isSerious && <span className="badge badge-critical">SAE</span>}
                        <span className={`badge badge-${ae.status === 'Closed' ? 'good' : ae.status === 'Under Review' ? 'warning' : 'neutral'}`}>{ae.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, marginBottom: 10 }}>
                      {ae.description.slice(0, 100)}...
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>
                      <span>Severity: <strong>{ae.severity}</strong></span>
                      <span>·</span>
                      <span>Causality: <strong>{ae.causality}</strong></span>
                      {ae.deadlineDays && <span>· <strong style={{ color: 'var(--status-critical)' }}>⏱ {ae.deadlineDays}d</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AE Detail Modal */}
      <Modal open={!!selectedAE} onClose={() => setSelectedAE(null)} title={selectedAE?.eventName || ''} size="lg"
        footer={selectedAE?.status !== 'Closed' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary btn-sm" onClick={() => handleReview(selectedAE!, 'Closed')}>Mark Closed</button>
            <button className="btn-primary btn-sm" onClick={() => handleReview(selectedAE!, 'Under Review')}>Mark Under Review</button>
          </div>
        ) : undefined}
      >
        {selectedAE && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '0.9375rem' }}>
            {[
              ['Participant', selectedAE.participantId], ['Reported Date', selectedAE.reportedDate],
              ['Severity', selectedAE.severity], ['Serious?', selectedAE.isSerious ? 'YES' : 'No'],
              ['Expected?', selectedAE.isExpected ? 'Yes' : 'No'], ['Causality', selectedAE.causality],
              ['Status', selectedAE.status], ['Priority', selectedAE.priority],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{k}</div>
                <div style={{ color: 'var(--surta-green-900)', fontWeight: 600 }}>{String(v)}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Description</div>
              <p style={{ margin: 0, color: 'var(--surta-green-900)', lineHeight: 1.6 }}>{selectedAE.description}</p>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Action Taken</div>
              <p style={{ margin: 0, color: 'var(--surta-green-900)', lineHeight: 1.6 }}>{selectedAE.actionTaken}</p>
            </div>
            {selectedAE.reviewerNotes && (
              <div style={{ gridColumn: '1/-1', background: 'var(--surta-ivory)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Reviewer Notes</div>
                <p style={{ margin: 0, color: 'var(--surta-green-900)' }}>{selectedAE.reviewerNotes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Report AE Modal */}
      <Modal open={showReportModal} onClose={() => setShowReportModal(false)} title="Report Adverse Event" size="lg"
        footer={<><button className="btn-secondary btn-sm" onClick={() => setShowReportModal(false)}>Cancel</button><button className="btn-danger btn-sm" form="ae-form" type="submit">Submit Report</button></>}
      >
        <form id="ae-form" onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="form-label">Participant *</label>
              <select className="form-input form-select" required value={reportForm.participantId} onChange={e => setReportForm(f => ({ ...f, participantId: e.target.value }))}>
                <option value="">Select...</option>
                {participants.slice(0,20).map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Severity *</label>
              <select className="form-input form-select" value={reportForm.severity} onChange={e => setReportForm(f => ({ ...f, severity: e.target.value as AdverseEvent['severity'] }))}>
                {['Mild','Moderate','Severe','Life-threatening','Fatal'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Event Name *</label>
            <input className="form-input" required value={reportForm.eventName} onChange={e => setReportForm(f => ({ ...f, eventName: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea className="form-input" required rows={3} value={reportForm.description} onChange={e => setReportForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="form-label">Causality</label>
              <select className="form-input form-select" value={reportForm.causality} onChange={e => setReportForm(f => ({ ...f, causality: e.target.value as AdverseEvent['causality'] }))}>
                {['Unrelated','Unlikely','Possible','Probable','Definite'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={reportForm.isSerious} onChange={e => setReportForm(f => ({ ...f, isSerious: e.target.checked }))} style={{ accentColor: 'var(--status-critical)', width: 16, height: 16 }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--status-critical)' }}>Serious Adverse Event (SAE)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={reportForm.isExpected} onChange={e => setReportForm(f => ({ ...f, isExpected: e.target.checked }))} style={{ accentColor: 'var(--surta-green-500)', width: 16, height: 16 }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Expected per protocol</span>
              </label>
            </div>
          </div>
          <div>
            <label className="form-label">Action Taken</label>
            <textarea className="form-input" rows={2} value={reportForm.actionTaken} onChange={e => setReportForm(f => ({ ...f, actionTaken: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          {reportForm.isSerious && (
            <div style={{ background: '#fde8e4', border: '1px solid #f5c2ba', borderRadius: 8, padding: '12px 14px', fontSize: '0.875rem', color: '#7a2e1f', fontWeight: 600 }}>
              ⚠ SAE selected — PI will be notified immediately. IEC reporting deadline: 24 hours.
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
