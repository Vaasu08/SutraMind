import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Shield, ClipboardCheck, Brain, BarChart3, Upload, ArrowRight, Leaf } from 'lucide-react';
import { PageHeader, SectionHeading, WorkflowStepper, ProgressBar, LoadingState, ErrorState, LeafDivider } from '../../components/ui';
import { trialService, participantService, intelligenceService, ethicsService } from '../../services';
import type { Trial, TrialHealthScore, Alert, EthicsReview } from '../../types/domain';

const TRIAL_STEPS = [
  { key: 'DRAFT', label: 'Created' },
  { key: 'ETHICS_SUBMITTED', label: 'Ethics Submitted' },
  { key: 'ETHICS_REVIEW', label: 'Under Review' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'COMPLETED', label: 'Completed' },
];

const STATUS_ORDER = ['DRAFT','ETHICS_SUBMITTED','ETHICS_REVIEW','APPROVED','ACTIVE','COMPLETED','CLOSED'];

function getStepStatus(stepKey: string, currentStatus: string): 'completed' | 'active' | 'pending' {
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  const currIdx = STATUS_ORDER.indexOf(currentStatus);
  if (stepIdx < currIdx) return 'completed';
  if (stepIdx === currIdx) return 'active';
  return 'pending';
}

interface ModuleCard { label: string; desc: string; icon: React.ReactNode; path: string; count?: string; }

export function TrialDetailPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState<Trial | null>(null);
  const [health, setHealth] = useState<TrialHealthScore | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ethics, setEthics] = useState<EthicsReview | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!trialId) return;
    const load = async () => {
      try {
        const [t, h, al, e, ps] = await Promise.all([
          trialService.getById(trialId),
          intelligenceService.getTrialHealth(trialId),
          intelligenceService.getAlerts(trialId),
          ethicsService.getByTrial(trialId),
          participantService.getByTrial(trialId),
        ]);
        if (!t) { setError(true); return; }
        setTrial(t); setHealth(h); setAlerts(al); setEthics(e);
        setParticipantCount(ps.length);
      } catch { setError(true); }
      finally { setLoading(false); }
    };
    load();
  }, [trialId]);

  if (loading) return <LoadingState />;
  if (error || !trial) return <ErrorState message="Trial not found." onRetry={() => navigate('/trials')} />;

  const modules: ModuleCard[] = [
    { label: 'Ethics', desc: ethics?.status.replace('_',' ') || 'Not submitted', icon: <ClipboardCheck size={20} />, path: 'ethics' },
    { label: 'Participants', desc: `${participantCount} enrolled`, icon: <Users size={20} />, path: 'participants' },
    { label: 'Visits', desc: 'Scheduling & CRFs', icon: <Calendar size={20} />, path: 'visits' },
    { label: 'Ayurveda', desc: 'Prakriti & Dosha', icon: <Leaf size={20} />, path: 'ayurveda' },
    { label: 'Safety', desc: `${alerts.filter(a => a.type === 'SAE_REVIEW').length > 0 ? '⚠ ' : ''}AE monitoring`, icon: <Shield size={20} />, path: 'safety' },
    { label: 'Compliance', desc: 'Requirements & deadlines', icon: <ClipboardCheck size={20} />, path: 'compliance' },
    { label: 'Intelligence', desc: 'Action Center + Health', icon: <Brain size={20} />, path: 'intelligence' },
    { label: 'Analytics', desc: 'Research Lens', icon: <BarChart3 size={20} />, path: 'analytics' },
    { label: 'FHIR Export', desc: 'Interoperability', icon: <Upload size={20} />, path: 'export' },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: trial.trialId }]}
        title={trial.shortTitle}
        subtitle={trial.condition}
        badge={<span className={`badge badge-${trial.status === 'ACTIVE' ? 'good' : 'neutral'}`}>{trial.status}</span>}
        actions={
          <button className="btn-primary" onClick={() => navigate(`/trials/${trialId}/intelligence`)}>
            <Brain size={16} /> Trial Intelligence
          </button>
        }
      />

      {/* Critical alerts strip */}
      {alerts.filter(a => a.priority === 'Critical').map(a => (
        <div key={a.id} style={{ background: '#fde8e4', border: '1px solid #f5c2ba', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={16} style={{ color: 'var(--status-critical)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: '#7a2e1f' }}>{a.title}</span>
          <button className="btn-danger btn-sm" onClick={() => navigate(`/trials/${trialId}/${a.navigateTo.split('/').pop()}`)}>
            Review <ArrowRight size={14} />
          </button>
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          {/* Trial details */}
          <div className="surta-card" style={{ padding: '24px', marginBottom: 24 }}>
            <SectionHeading eyebrow="Protocol" title="Trial Information" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '0.875rem' }}>
              {[
                ['Trial ID', trial.trialId], ['Phase', trial.phase], ['Study Type', trial.studyType],
                ['PI', trial.principalInvestigator], ['Start Date', trial.startDate], ['End Date', trial.endDate],
                ['Duration', `${trial.durationWeeks} weeks`], ['Target Enrollment', trial.targetEnrollment],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{k}</div>
                  <div style={{ color: 'var(--surta-green-900)', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>

            <LeafDivider label="Ayurveda Specific" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '0.875rem' }}>
              {[
                ['Ayurvedic Intervention', trial.ayurvedicIntervention],
                ['AFI Reference', trial.afiReference],
                ['Ayurvedic Diagnosis', trial.ayurvedicDiagnosis],
                ['Dosha Consideration', trial.doshaConsideration],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{k}</div>
                  <div style={{ color: 'var(--surta-green-900)', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow stepper */}
          <div className="surta-card" style={{ padding: '24px', marginBottom: 24 }}>
            <SectionHeading eyebrow="Lifecycle" title="Trial Status" />
            <WorkflowStepper
              steps={TRIAL_STEPS.map(s => ({
                label: s.label,
                status: getStepStatus(s.key, trial.status),
              }))}
            />
          </div>

          {/* Objectives */}
          <div className="surta-card" style={{ padding: '24px' }}>
            <SectionHeading eyebrow="Science" title="Objectives & Outcomes" />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Objective</div>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--surta-green-900)', lineHeight: 1.6 }}>{trial.objective}</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Primary Outcome</div>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--surta-green-900)' }}>{trial.primaryOutcome}</p>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Secondary Outcomes</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {trial.secondaryOutcomes.map((o, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--surta-green-900)', marginBottom: 4 }}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right column — health + modules */}
        <div>
          {/* Trial Health Card */}
          {health && (
            <div className="surta-card" style={{ padding: '22px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {/* botanical watermark */}
              <div className="botanical-watermark" style={{ right: -20, bottom: -20, fontSize: 80 }}>🌿</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Trial Health</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '3.5rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: health.overall >= 80 ? 'var(--status-good)' : '#996e00', lineHeight: 1 }}>
                    {health.overall}
                  </span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--status-neutral)', fontWeight: 500 }}>/100</span>
                </div>
                <div className={`badge badge-${health.overall >= 80 ? 'good' : 'warning'}`} style={{ marginBottom: 20 }}>
                  {health.label}
                </div>
                {[
                  ['Enrollment', health.enrollment],
                  ['Follow-up', health.followUp],
                  ['Data Quality', health.dataQuality],
                  ['Safety', health.safety],
                  ['Compliance', health.compliance],
                ].map(([label, value]) => (
                  <div key={String(label)} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--surta-green-700)', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--surta-green-900)' }}>{value}%</span>
                    </div>
                    <ProgressBar value={Number(value)} showLabel={false} height={5}
                      variant={Number(value) < 70 ? 'critical' : Number(value) < 80 ? 'gold' : 'default'}
                    />
                  </div>
                ))}
                <button className="btn-secondary btn-sm" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }} onClick={() => navigate(`/trials/${trialId}/intelligence`)}>
                  View Intelligence →
                </button>
              </div>
            </div>
          )}

          {/* Module grid */}
          <div>
            <SectionHeading eyebrow="Modules" title="Navigate" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {modules.map(m => (
                <div
                  key={m.label}
                  className="surta-card"
                  style={{ padding: '14px 16px', cursor: 'pointer' }}
                  onClick={() => navigate(`/trials/${trialId}/${m.path}`)}
                >
                  <div style={{ color: 'var(--surta-green-500)', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-900)', marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)' }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
