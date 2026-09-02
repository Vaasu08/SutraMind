import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Eye, Upload } from 'lucide-react';
import { PageHeader, SectionHeading, LoadingState, LeafDivider } from '../../components/ui';
import { fhirService, participantService, visitService, safetyService } from '../../services';
import { useApp } from '../../context/AppContext';

export function ExportPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [bundle, setBundle] = useState<object | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showJSON, setShowJSON] = useState(false);
  const [stats, setStats] = useState({ participants: 0, visits: 0, aes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      participantService.getByTrial(trialId || 'trial-001'),
      visitService.getByTrial(trialId || 'trial-001'),
      safetyService.getByTrial(trialId || 'trial-001'),
    ]).then(([p, v, ae]) => {
      setStats({ participants: p.length, visits: v.filter(vi => vi.status === 'Completed').length, aes: ae.length });
      setLoading(false);
    });
  }, [trialId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await fhirService.generateBundle(trialId || 'trial-001');
      setBundle(result);
      showToast('success', 'FHIR R4 Bundle generated', `${(result as { total: number }).total} resources packaged`);
    } catch {
      showToast('error', 'Failed to generate FHIR bundle');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!bundle) return;
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `fhir-ayu001-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'FHIR bundle downloaded');
  };

  if (loading) return <LoadingState />;

  const bundleTotal = bundle ? (bundle as { total: number }).total : 0;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Export' }]}
        title="FHIR Export"
        subtitle="Generate HL7 FHIR R4 interoperability bundle"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          {/* FHIR info card */}
          <div className="surta-card" style={{ padding: 24, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05, fontSize: 80 }}>🌿</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <SectionHeading eyebrow="Interoperability" title="FHIR R4 Export" />
              <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>
                Generate a FHIR R4 Bundle containing participant demographics, clinical encounters, observations (MMSE, RAVLT scores), and adverse event records. Compatible with HL7 FHIR R4 specification.
              </p>

              {/* Dataset summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Participants', value: stats.participants, resource: 'Patient' },
                  { label: 'Observations', value: stats.visits * 4, resource: 'Observation' },
                  { label: 'Encounters', value: stats.visits, resource: 'Encounter' },
                  { label: 'Adverse Events', value: stats.aes, resource: 'AdverseEvent' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '14px 12px', background: 'var(--surta-ivory)', borderRadius: 10, border: '1px solid var(--surta-green-100)' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--surta-green-900)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--surta-green-500)', fontWeight: 600, marginTop: 2 }}>FHIR {s.resource}</div>
                  </div>
                ))}
              </div>

              {/* Generate button */}
              {!bundle ? (
                <button className="btn-gold" onClick={handleGenerate} disabled={generating} style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '1rem' }}>
                  <Upload size={20} />
                  {generating ? 'Generating FHIR Bundle...' : 'Generate FHIR R4 Bundle'}
                </button>
              ) : (
                <div>
                  <div style={{ background: 'var(--surta-green-100)', border: '1px solid var(--surta-green-500)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.25rem' }}>✓</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--status-good)' }}>FHIR R4 Bundle Generated</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--surta-green-700)' }}>{bundleTotal} resources · {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-primary" onClick={() => setShowJSON(p => !p)} style={{ flex: 1, justifyContent: 'center' }}>
                      <Eye size={16} /> {showJSON ? 'Hide JSON' : 'View JSON'}
                    </button>
                    <button className="btn-gold" onClick={handleDownload} style={{ flex: 1, justifyContent: 'center' }}>
                      <Download size={16} /> Download JSON
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => setBundle(null)}>Regenerate</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* JSON preview */}
          {bundle && showJSON && (
            <div className="surta-card" style={{ padding: 20 }}>
              <SectionHeading eyebrow="Preview" title="FHIR Bundle JSON" />
              <pre style={{ fontSize: '0.75rem', color: '#374151', background: 'var(--surta-ivory)', padding: 16, borderRadius: 8, overflowX: 'auto', maxHeight: 480, overflowY: 'auto', lineHeight: 1.6 }}>
                {JSON.stringify(bundle, null, 2).slice(0, 8000)}{JSON.stringify(bundle, null, 2).length > 8000 ? '\n\n... (truncated — download for full bundle)' : ''}
              </pre>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div>
          <div className="surta-card" style={{ padding: 20, marginBottom: 16 }}>
            <SectionHeading eyebrow="Standard" title="FHIR R4 Resources" />
            {[
              { resource: 'Patient', desc: 'Participant demographics, Prakriti extension, trial arm' },
              { resource: 'Encounter', desc: 'Study visits with period, type, and status' },
              { resource: 'Observation', desc: 'MMSE, RAVLT, HAM-A, PSQI scores per visit' },
              { resource: 'AdverseEvent', desc: 'All AEs with severity, causality, and seriousness' },
            ].map(r => (
              <div key={r.resource} style={{ padding: '10px 0', borderBottom: '1px solid var(--surta-green-100)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-700)', marginBottom: 2 }}>{r.resource}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>{r.desc}</div>
              </div>
            ))}
          </div>
          <div className="surta-card" style={{ padding: 20 }}>
            <SectionHeading eyebrow="Extensions" title="Ayurveda Extensions" />
            <p style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', lineHeight: 1.5 }}>
              Custom FHIR extensions under <code style={{ background: 'var(--surta-green-100)', padding: '1px 4px', borderRadius: 3 }}>urn:surtamind</code> namespace carry Ayurveda-specific data:
            </p>
            {[
              'urn:surtamind:prakriti — Dominant Prakriti type',
              'urn:surtamind:trial-arm — Treatment / Control',
              'urn:surtamind:dosha-vata — Vata Vikruti score',
              'urn:surtamind:dosha-pitta — Pitta Vikruti score',
            ].map(e => (
              <div key={e} style={{ fontSize: '0.8125rem', color: 'var(--surta-green-700)', padding: '6px 0', borderBottom: '1px solid var(--surta-green-100)', fontFamily: 'monospace' }}>{e}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
