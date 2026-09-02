import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { trialService } from '../../services';
import { useApp } from '../../context/AppContext';
import { FlaskConical, Calendar, Users, Leaf } from 'lucide-react';

// Section header with number and icon
function FormSection({
  number, title, icon, children, tinted = false
}: {
  number: number; title: string; icon?: React.ReactNode;
  children: React.ReactNode; tinted?: boolean;
}) {
  return (
    <div style={{
      background: tinted ? 'var(--sm-ivory-sage)' : 'var(--sm-white)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
    }}>
      {/* Section title bar */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: tinted ? 'rgba(233,240,229,0.6)' : 'var(--sm-ivory)',
      }}>
        <div style={{
          width: 26, height: 26,
          borderRadius: '50%',
          background: 'var(--sm-forest)',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700,
          flexShrink: 0,
        }}>
          {number}
        </div>
        {icon && (
          <span style={{ color: 'var(--sm-leaf)' }}>{icon}</span>
        )}
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400,
          color: 'var(--sm-forest)', margin: 0,
        }}>
          {title}
        </h3>
      </div>
      {/* Section body */}
      <div style={{ padding: '22px 24px' }}>
        {children}
      </div>
    </div>
  );
}

// Styled label + input group
function Field({
  label, hint, children, span = 1
}: {
  label: string; hint?: string; children: React.ReactNode; span?: number;
}) {
  return (
    <div style={{ gridColumn: span === 2 ? '1/-1' : undefined }}>
      <label className="form-label">{label}</label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

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
    <div className="animate-fadeIn" style={{ maxWidth: 1200 }}>
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'New Trial' }]}
        title="Create New Trial"
        subtitle="Define the clinical protocol and study parameters"
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* ── Form sections ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* 1 — Basic Information */}
            <FormSection number={1} title="Basic Information" icon={<FlaskConical size={15} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Trial ID *" hint="e.g. AYU-002, AYU-003">
                  <input
                    className="form-input"
                    required
                    placeholder="AYU-002"
                    value={form.trialId}
                    onChange={e => set('trialId', e.target.value)}
                  />
                </Field>
                <Field label="Phase *">
                  <select className="form-input form-select" value={form.phase} onChange={e => set('phase', e.target.value)}>
                    {['Pilot','Phase I','Phase II','Phase III','Phase IV'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Full Protocol Title *" span={2}>
                  <input
                    className="form-input"
                    required
                    placeholder="Full official title of the clinical study"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                  />
                </Field>
                <Field label="Short / Display Title *" span={2} hint="This appears in the dashboard and trial list">
                  <input
                    className="form-input"
                    required
                    placeholder="Ashwagandha Cognitive Study"
                    value={form.shortTitle}
                    onChange={e => set('shortTitle', e.target.value)}
                  />
                </Field>
                <Field label="Study Type">
                  <select className="form-input form-select" value={form.studyType} onChange={e => set('studyType', e.target.value)}>
                    {['Interventional','Observational','Retrospective'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Principal Investigator">
                  <input className="form-input" value={form.principalInvestigator} onChange={e => set('principalInvestigator', e.target.value)} />
                </Field>
                <Field label="Condition / Indication *" hint="Primary condition being studied">
                  <input
                    className="form-input"
                    required
                    placeholder="e.g. Cognitive decline, Chronic fatigue"
                    value={form.condition}
                    onChange={e => set('condition', e.target.value)}
                  />
                </Field>
              </div>
            </FormSection>

            {/* 2 — Timeline & Enrollment */}
            <FormSection number={2} title="Timeline & Enrollment" icon={<Calendar size={15} />} tinted>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Start Date">
                  <input className="form-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                </Field>
                <Field label="End Date">
                  <input className="form-input" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
                </Field>
                <Field label="Duration (weeks)" hint="Study duration from enrollment to final visit">
                  <input className="form-input" type="number" min={1} value={form.durationWeeks} onChange={e => set('durationWeeks', Number(e.target.value))} />
                </Field>
                <Field label="Target Enrollment" hint="Total participants to be recruited">
                  <input className="form-input" type="number" min={1} value={form.targetEnrollment} onChange={e => set('targetEnrollment', Number(e.target.value))} />
                </Field>
              </div>
            </FormSection>

            {/* 3 — Objectives & Outcomes */}
            <FormSection number={3} title="Objectives & Outcomes" icon={<Users size={15} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="Primary Objective" hint="State the main research question">
                  <textarea
                    className="form-input"
                    rows={3}
                    value={form.objective}
                    onChange={e => set('objective', e.target.value)}
                    style={{ resize: 'vertical' }}
                    placeholder="To evaluate the efficacy of Ashwagandha extract on cognitive performance markers in adults aged 40–65"
                  />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Primary Outcome Measure">
                    <input
                      className="form-input"
                      value={form.primaryOutcome}
                      onChange={e => set('primaryOutcome', e.target.value)}
                      placeholder="e.g. MMSE score change at 12 weeks"
                    />
                  </Field>
                  <Field label="Intervention" hint="Study treatment / formulation">
                    <input
                      className="form-input"
                      value={form.intervention}
                      onChange={e => set('intervention', e.target.value)}
                      placeholder="Ashwagandha Ghana Vati 500mg BD"
                    />
                  </Field>
                  <Field label="Comparator / Control">
                    <input
                      className="form-input"
                      value={form.comparator}
                      onChange={e => set('comparator', e.target.value)}
                      placeholder="Placebo"
                    />
                  </Field>
                </div>
              </div>
            </FormSection>

            {/* 4 — Ayurveda Specifics */}
            <FormSection number={4} title="Ayurveda Specifics" icon={<Leaf size={15} />} tinted>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Ayurvedic Intervention" hint="Formulation name with standardization">
                  <input
                    className="form-input"
                    placeholder="Withania somnifera (L.) Dunal — standardized extract"
                    value={form.ayurvedicIntervention}
                    onChange={e => set('ayurvedicIntervention', e.target.value)}
                  />
                </Field>
                <Field label="AFI Reference" hint="Ayurvedic Formulary of India reference">
                  <input
                    className="form-input"
                    placeholder="AFI Part I, Vol. II, Page 94"
                    value={form.afiReference}
                    onChange={e => set('afiReference', e.target.value)}
                  />
                </Field>
                <Field label="Ayurvedic Diagnosis" hint="Sanskrit term + English equivalent">
                  <input
                    className="form-input"
                    placeholder="Smriti Bhramsha / Cognitive Decline"
                    value={form.ayurvedicDiagnosis}
                    onChange={e => set('ayurvedicDiagnosis', e.target.value)}
                  />
                </Field>
                <Field label="Dosha Consideration">
                  <input
                    className="form-input"
                    placeholder="Predominant Vata-Kapha involvement"
                    value={form.doshaConsideration}
                    onChange={e => set('doshaConsideration', e.target.value)}
                  />
                </Field>
              </div>
            </FormSection>
          </div>

          {/* ── Protocol Summary panel ── */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{
              background: 'var(--sm-forest)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              color: 'white',
            }}>
              {/* Header */}
              <div style={{
                padding: '18px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Leaf size={14} style={{ color: 'rgba(157,196,159,0.8)' }} />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', fontWeight: 400, color: 'rgba(255,255,255,0.88)' }}>
                  Protocol Summary
                </span>
              </div>

              {/* Summary fields */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Trial ID',    value: form.trialId || '—' },
                  { label: 'Phase',       value: form.phase },
                  { label: 'Study Type',  value: form.studyType },
                  { label: 'PI',          value: form.principalInvestigator },
                  { label: 'Target',      value: `${form.targetEnrollment} participants` },
                  { label: 'Duration',    value: `${form.durationWeeks} weeks` },
                ].map((item, i) => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '9px 0',
                    borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.04em' }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.88)', textAlign: 'right', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.value}
                    </span>
                  </div>
                ))}

                {/* Status */}
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)' }}>Status</span>
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 700,
                    background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
                    padding: '2px 9px', borderRadius: 'var(--radius-xs)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    DRAFT
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  className="btn-gold"
                  type="submit"
                  disabled={saving}
                  style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Creating…' : 'Create Trial →'}
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.55)', background: 'transparent' }}
                  onClick={() => navigate('/trials')}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Help note */}
            <div style={{
              marginTop: 12, padding: '12px 14px',
              background: 'var(--sm-botanical-x)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--sm-text-soft)', margin: 0, lineHeight: 1.6 }}>
                The trial will be created in <strong style={{ color: 'var(--sm-text-mid)' }}>DRAFT</strong> status. You can submit for ethics approval once the protocol is complete.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
