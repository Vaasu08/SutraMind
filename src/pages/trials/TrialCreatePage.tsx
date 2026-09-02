import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { trialService } from '../../services';
import { useApp } from '../../context/AppContext';

export function TrialCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    trialId: '', title: '', shortTitle: '', principalInvestigator: 'Dr. Priya Sharma',
    studyType: 'Interventional' as 'Interventional' | 'Observational' | 'Retrospective',
    phase: 'Phase II' as 'Pilot' | 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV',
    condition: '', objective: '', primaryOutcome: '', secondaryOutcomes: [''],
    intervention: '', comparator: '', durationWeeks: 12, targetEnrollment: 100,
    startDate: '', endDate: '',
    ayurvedicIntervention: '', afiReference: '', ayurvedicDiagnosis: '', doshaConsideration: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const trial = await trialService.create({
        ...form,
        currentEnrollment: 0,
        status: 'DRAFT' as const,
        ethicsStatus: 'NOT_SUBMITTED' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast('success', 'Trial created', `${trial.trialId} created in DRAFT status`);
      navigate(`/trials/${trial.id}`);
    } catch {
      showToast('error', 'Failed to create trial');
    } finally {
      setSaving(false);
    }
  };

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'New Trial' }]}
        title="Create New Trial"
        subtitle="Define the clinical trial protocol"
      />
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Basic info */}
            <div className="surta-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 18px', fontFamily: 'var(--font-heading)', color: 'var(--surta-green-900)' }}>Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label">Trial ID *</label>
                  <input className="form-input" required placeholder="AYU-002" value={form.trialId} onChange={e => set('trialId', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Phase *</label>
                  <select className="form-input form-select" value={form.phase} onChange={e => set('phase', e.target.value)}>
                    {['Pilot','Phase I','Phase II','Phase III','Phase IV'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Full Title *</label>
                  <input className="form-input" required placeholder="Full trial title" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Short Title *</label>
                  <input className="form-input" required placeholder="Short display title" value={form.shortTitle} onChange={e => set('shortTitle', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Study Type</label>
                  <select className="form-input form-select" value={form.studyType} onChange={e => set('studyType', e.target.value)}>
                    {['Interventional','Observational','Retrospective'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Principal Investigator</label>
                  <input className="form-input" value={form.principalInvestigator} onChange={e => set('principalInvestigator', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Condition / Indication *</label>
                  <input className="form-input" required placeholder="e.g. Chronic fatigue syndrome" value={form.condition} onChange={e => set('condition', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Target Enrollment</label>
                  <input className="form-input" type="number" min={1} value={form.targetEnrollment} onChange={e => set('targetEnrollment', Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label">Start Date</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">End Date</label>
                  <input className="form-input" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Duration (weeks)</label>
                  <input className="form-input" type="number" min={1} value={form.durationWeeks} onChange={e => set('durationWeeks', Number(e.target.value))} />
                </div>
              </div>
            </div>

            {/* Science */}
            <div className="surta-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 18px', fontFamily: 'var(--font-heading)', color: 'var(--surta-green-900)' }}>Objectives & Outcomes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="form-label">Objective</label>
                  <textarea className="form-input" rows={3} value={form.objective} onChange={e => set('objective', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="form-label">Primary Outcome</label>
                  <input className="form-input" value={form.primaryOutcome} onChange={e => set('primaryOutcome', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Intervention</label>
                  <input className="form-input" placeholder="e.g. Ashwagandha Ghana Vati 500mg BD" value={form.intervention} onChange={e => set('intervention', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Comparator</label>
                  <input className="form-input" placeholder="e.g. Placebo" value={form.comparator} onChange={e => set('comparator', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Ayurveda */}
            <div className="surta-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 18px', fontFamily: 'var(--font-heading)', color: 'var(--surta-green-900)' }}>Ayurveda Specifics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Ayurvedic Intervention</label>
                  <input className="form-input" placeholder="Formulation name + standardization" value={form.ayurvedicIntervention} onChange={e => set('ayurvedicIntervention', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">AFI Reference</label>
                  <input className="form-input" placeholder="e.g. AFI Part I, Vol. II" value={form.afiReference} onChange={e => set('afiReference', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Ayurvedic Diagnosis</label>
                  <input className="form-input" placeholder="Sanskrit + English" value={form.ayurvedicDiagnosis} onChange={e => set('ayurvedicDiagnosis', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Dosha Consideration</label>
                  <input className="form-input" placeholder="Expected dosha involvement" value={form.doshaConsideration} onChange={e => set('doshaConsideration', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <div>
            <div className="surta-card" style={{ padding: 20, position: 'sticky', top: 84 }}>
              <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-heading)', color: 'var(--surta-green-900)', fontSize: '1rem' }}>Trial Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem', marginBottom: 20 }}>
                <div><span style={{ color: 'var(--status-neutral)' }}>ID: </span><strong>{form.trialId || '—'}</strong></div>
                <div><span style={{ color: 'var(--status-neutral)' }}>Phase: </span><strong>{form.phase}</strong></div>
                <div><span style={{ color: 'var(--status-neutral)' }}>Type: </span><strong>{form.studyType}</strong></div>
                <div><span style={{ color: 'var(--status-neutral)' }}>Target: </span><strong>{form.targetEnrollment} participants</strong></div>
                <div><span style={{ color: 'var(--status-neutral)' }}>Duration: </span><strong>{form.durationWeeks} weeks</strong></div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ color: 'var(--status-neutral)' }}>Status: </span>
                  <span className="badge badge-neutral">DRAFT</span>
                </div>
              </div>
              <button className="btn-primary" type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                {saving ? 'Creating...' : 'Create Trial →'}
              </button>
              <button className="btn-secondary btn-sm" type="button" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={() => navigate('/trials')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
