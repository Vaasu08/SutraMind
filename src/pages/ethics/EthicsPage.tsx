import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeading, Timeline, LoadingState } from '../../components/ui';
import { ethicsService } from '../../services';
import { useApp } from '../../context/AppContext';
import type { EthicsReview } from '../../types/domain';

export function EthicsPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [ethics, setEthics] = useState<EthicsReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ethicsService.getByTrial(trialId || 'trial-001').then(e => { setEthics(e); setLoading(false); });
  }, [trialId]);

  const handleSubmit = async () => {
    const updated = await ethicsService.submit(trialId || 'trial-001');
    setEthics(updated);
    showToast('success', 'Protocol submitted to IEC', 'Ethics review initiated');
  };

  const handleApprove = async () => {
    if (!ethics) return;
    const updated = await ethicsService.approve(ethics.id, 'IEC/AIIA/2026/001-R', '2027-09-23');
    if (updated) setEthics(updated);
    showToast('success', 'Ethics approval recorded');
  };

  if (loading) return <LoadingState />;

  const statusColors: Record<string, string> = {
    APPROVED: 'var(--status-good)', SUBMITTED: 'var(--status-warning)',
    UNDER_REVIEW: 'var(--status-warning)', REJECTED: 'var(--status-critical)',
    NOT_SUBMITTED: 'var(--status-neutral)', RENEWAL_DUE: 'var(--status-critical)',
  };

  const isExpiringSoon = ethics?.expiryDate &&
    Math.ceil((new Date(ethics.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 30;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Ethics' }]}
        title="Ethics Review"
        subtitle="Institutional Ethics Committee — IEC/AIIA"
      />

      {isExpiringSoon && ethics && (
        <div style={{ background: '#fde8e4', border: '1px solid #f5c2ba', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.25rem' }}>⚠</span>
          <div>
            <strong style={{ color: 'var(--status-critical)' }}>Ethics approval expires in {Math.ceil((new Date(ethics.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</strong>
            <div style={{ fontSize: '0.875rem', color: '#7a2e1f', marginTop: 2 }}>
              {ethics.approvalNumber} expires {ethics.expiryDate}. Renewal must be submitted before expiry.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          {/* Status card */}
          <div className="surta-card" style={{ padding: 24, marginBottom: 20 }}>
            <SectionHeading eyebrow="Status" title="Ethics Approval" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', fontSize: '0.875rem', marginBottom: 20 }}>
              {[
                ['Ethics Status', <span style={{ fontWeight: 700, color: statusColors[ethics?.status || 'NOT_SUBMITTED'] || 'var(--status-neutral)' }}>{ethics?.status?.replace(/_/g,' ') || 'NOT SUBMITTED'}</span>],
                ['Approval Number', ethics?.approvalNumber || '—'],
                ['Approval Date', ethics?.approvalDate || '—'],
                ['Expiry / Renewal Date', ethics?.expiryDate || '—'],
                ['Submission Date', ethics?.submissionDate || '—'],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{k}</div>
                  <div style={{ color: 'var(--surta-green-900)', fontWeight: 500 }}>{v as React.ReactNode}</div>
                </div>
              ))}
              {ethics?.reviewerNotes && (
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Reviewer Notes</div>
                  <div style={{ background: 'var(--surta-ivory)', padding: '10px 14px', borderRadius: 8, fontSize: '0.9375rem', color: 'var(--surta-green-900)', lineHeight: 1.6 }}>{ethics.reviewerNotes}</div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(!ethics || ethics.status === 'NOT_SUBMITTED') && <button className="btn-primary" onClick={handleSubmit}>Submit for Review</button>}
              {ethics?.status === 'APPROVED' && <button className="btn-primary" onClick={handleSubmit}>Submit Renewal</button>}
              <button className="btn-secondary btn-sm" onClick={handleApprove}>Record Approval</button>
              <button className="btn-secondary btn-sm">Upload Approval Document</button>
            </div>
          </div>

          {/* Timeline */}
          <div className="surta-card" style={{ padding: 24 }}>
            <SectionHeading eyebrow="History" title="Review Timeline" />
            {ethics?.timeline && ethics.timeline.length > 0 ? (
              <Timeline
                events={ethics.timeline.map(e => ({
                  date: e.date,
                  title: e.event,
                  description: e.actor,
                  status: e.type === 'approval' ? 'completed' : e.type === 'renewal' ? 'active' : 'completed',
                }))}
              />
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--status-neutral)', fontSize: '0.875rem' }}>No ethics review events yet</div>
            )}
          </div>
        </div>

        {/* Requirements panel */}
        <div>
          <div className="surta-card" style={{ padding: 20 }}>
            <SectionHeading eyebrow="Checklist" title="Ethics Requirements" />
            {[
              { item: 'Protocol submitted', done: !!ethics?.submissionDate },
              { item: 'Informed consent form submitted', done: !!ethics?.submissionDate },
              { item: 'Investigator CV submitted', done: !!ethics?.submissionDate },
              { item: 'IEC review completed', done: ethics?.status === 'APPROVED' },
              { item: 'Approval letter obtained', done: !!ethics?.approvalNumber },
              { item: 'Approval on file', done: !!ethics?.approvalDate },
              { item: 'Annual renewal submitted', done: !isExpiringSoon },
            ].map(r => (
              <div key={r.item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--surta-green-100)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: r.done ? 'var(--surta-green-100)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: r.done ? 'var(--status-good)' : 'var(--status-neutral)' }}>{r.done ? '✓' : '○'}</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: r.done ? 'var(--surta-green-900)' : 'var(--status-neutral)', fontWeight: r.done ? 500 : 400 }}>{r.item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
