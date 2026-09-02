import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader, SectionHeading, Timeline, ProgressBar,
  LoadingState, ErrorState, LeafDivider, StatusBadge
} from '../../components/ui';
import { participantService, visitService, ayurvedaService, safetyService, crfService } from '../../services';
import type { Participant, Visit, PrakritiAssessment, DoshaAssessment, AdverseEvent } from '../../types/domain';

function DoshaBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color }}>{label}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--surta-green-900)' }}>{value}/10</span>
      </div>
      <div className="progress-track" style={{ height: 8 }}>
        <div style={{ height: '100%', background: color, borderRadius: 3, width: `${value * 10}%`, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export function ParticipantProfilePage() {
  const { trialId, participantId } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [prakriti, setPrakriti] = useState<PrakritiAssessment | null>(null);
  const [doshaHistory, setDoshaHistory] = useState<DoshaAssessment[]>([]);
  const [aes, setAEs] = useState<AdverseEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!participantId) return;
    Promise.all([
      participantService.getById(participantId),
      visitService.getByParticipant(participantId),
      ayurvedaService.getPrakritiAssessment(participantId),
      ayurvedaService.getDoshaAssessments(participantId),
      safetyService.getByParticipant(participantId),
    ]).then(([p, v, pr, da, ae]) => {
      setParticipant(p); setVisits(v); setPrakriti(pr);
      setDoshaHistory(da); setAEs(ae); setLoading(false);
    });
  }, [participantId]);

  if (loading) return <LoadingState />;
  if (!participant) return <ErrorState message="Participant not found." />;

  const latestDosha = doshaHistory[doshaHistory.length - 1];
  const visitTimeline = visits.map(v => ({
    date: v.actualDate || v.scheduledDate,
    title: `${v.visitName}`,
    description: v.notes || undefined,
    status: (v.status === 'Completed' ? 'completed' : v.status === 'Overdue' ? 'active' : 'pending') as 'completed' | 'active' | 'pending',
  }));

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[
          { label: 'Trials', onClick: () => navigate('/trials') },
          { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) },
          { label: 'Participants', onClick: () => navigate(`/trials/${trialId}/participants`) },
          { label: participant.id },
        ]}
        title={participant.id}
        subtitle={participant.name}
        badge={
          <div style={{ display: 'flex', gap: 6 }}>
            <span className={`badge badge-${participant.status === 'Enrolled' ? 'good' : 'neutral'}`}>{participant.status}</span>
            {participant.safetyStatus !== 'Normal' && (
              <span className={`badge badge-${participant.safetyStatus === 'SAE' ? 'critical' : 'warning'}`}>{participant.safetyStatus}</span>
            )}
          </div>
        }
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary btn-sm" onClick={() => navigate(`/trials/${trialId}/ayurveda?participant=${participantId}`)}>Prakriti</button>
            <button className="btn-secondary btn-sm" onClick={() => navigate(`/trials/${trialId}/safety?participant=${participantId}`)}>Report AE</button>
            <button className="btn-primary btn-sm" onClick={() => navigate(`/trials/${trialId}/visits?participant=${participantId}`)}>Record Visit</button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Basic info */}
        <div className="surta-card" style={{ padding: 20 }}>
          <SectionHeading eyebrow="Demographics" title="Basic Information" className="mb-0" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, fontSize: '0.875rem' }}>
            {[['Age', `${participant.age} years`], ['Sex', participant.sex === 'M' ? 'Male' : participant.sex === 'F' ? 'Female' : 'Other'], ['Height', `${participant.heightCm} cm`], ['Weight', `${participant.weightKg} kg`], ['Arm', participant.arm], ['Enrolled', participant.enrollmentDate]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--status-neutral)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--surta-green-900)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ayurveda */}
        <div className="surta-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05, fontSize: 80 }}>🌿</div>
          <SectionHeading eyebrow="Ayurveda" title="Prakriti & Dosha" className="mb-0" />
          <div style={{ marginTop: 16 }}>
            {prakriti ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', marginBottom: 4 }}>Dominant Prakriti</div>
                  <div className={`badge badge-${prakriti.dominantPrakriti.toLowerCase() as 'vata'|'pitta'|'kapha'}`} style={{ fontSize: '1rem', padding: '6px 18px' }}>
                    {prakriti.dominantPrakriti.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4, color: 'var(--surta-green-900)' }}>
                    {Math.max(prakriti.vataScore, prakriti.pittaScore, prakriti.kaphaScore)}%
                  </div>
                </div>
                <div style={{ fontSize: '0.8125rem', display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <span style={{ color: 'var(--dosha-vata)' }}>V {prakriti.vataScore}%</span>
                  <span style={{ color: 'var(--status-neutral)' }}>·</span>
                  <span style={{ color: 'var(--dosha-pitta)' }}>P {prakriti.pittaScore}%</span>
                  <span style={{ color: 'var(--status-neutral)' }}>·</span>
                  <span style={{ color: 'var(--dosha-kapha)' }}>K {prakriti.kaphaScore}%</span>
                </div>
              </>
            ) : <div style={{ color: 'var(--status-neutral)', fontSize: '0.875rem', marginTop: 8 }}>Not assessed yet</div>}

            {latestDosha && (
              <>
                <LeafDivider label="Current Vikruti" />
                <DoshaBar label="Vata" value={latestDosha.vataScore} color="var(--dosha-vata)" />
                <DoshaBar label="Pitta" value={latestDosha.pittaScore} color="var(--dosha-pitta)" />
                <DoshaBar label="Kapha" value={latestDosha.kaphaScore} color="var(--dosha-kapha)" />
              </>
            )}
          </div>
        </div>

        {/* Safety */}
        <div className="surta-card" style={{ padding: 20 }}>
          <SectionHeading eyebrow="Safety" title="Adverse Events" className="mb-0" />
          <div style={{ marginTop: 16 }}>
            {aes.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>✓</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--status-neutral)' }}>No active adverse events</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {aes.map(ae => (
                  <div key={ae.id} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: ae.isSerious ? '#fde8e4' : '#fef6d9',
                    border: `1px solid ${ae.isSerious ? '#f5c2ba' : '#f5e09a'}`,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: ae.isSerious ? 'var(--status-critical)' : '#7a5c00', marginBottom: 3 }}>
                      {ae.isSerious ? '🔴 SAE' : '🟡'} {ae.eventName}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                      {ae.severity} · {ae.status} · {ae.reportedDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visit timeline */}
      <div className="surta-card" style={{ padding: 24 }}>
        <SectionHeading eyebrow="Visits" title="Participant Journey" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Visual visit cards */}
          <div style={{ display: 'flex', gap: 12 }}>
            {visits.map(v => (
              <div key={v.id} style={{
                flex: 1, padding: '14px 12px', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                background: v.status === 'Completed' ? 'var(--surta-green-100)' : v.status === 'Overdue' ? '#fde8e4' : v.status === 'Due' ? '#fef6d9' : 'white',
                border: `1.5px solid ${v.status === 'Completed' ? 'var(--surta-green-500)' : v.status === 'Overdue' ? 'var(--status-critical)' : v.status === 'Due' ? 'var(--status-warning)' : 'var(--surta-green-100)'}`,
              }} onClick={() => navigate(`/trials/${trialId}/visits`)}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-900)', marginBottom: 3 }}>V{v.visitNumber}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', marginBottom: 6 }}>{v.visitName.split(' ')[0]}</div>
                <div style={{ fontSize: '1.25rem' }}>
                  {v.status === 'Completed' ? '✓' : v.status === 'Overdue' ? '⚠' : v.status === 'Due' ? '●' : '○'}
                </div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, marginTop: 4, color: v.status === 'Completed' ? 'var(--status-good)' : v.status === 'Overdue' ? 'var(--status-critical)' : 'var(--status-neutral)' }}>
                  {v.status}
                </div>
              </div>
            ))}
          </div>
          {/* Timeline detail */}
          <div>
            <Timeline events={visitTimeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
