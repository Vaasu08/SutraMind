import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeading, LoadingState, LeafDivider } from '../../components/ui';
import { ayurvedaService } from '../../services';
import type { Formulation } from '../../types/domain';

const PRAKRITI_QUESTIONS = [
  { id: 'q1', question: 'Body frame and build?', options: [{ label: 'Thin, light', dosha: 'V' }, { label: 'Medium, muscular', dosha: 'P' }, { label: 'Broad, heavy', dosha: 'K' }] },
  { id: 'q2', question: 'Skin type and texture?', options: [{ label: 'Dry, rough, thin', dosha: 'V' }, { label: 'Warm, reddish, oily', dosha: 'P' }, { label: 'Thick, oily, cool, smooth', dosha: 'K' }] },
  { id: 'q3', question: 'Hair characteristics?', options: [{ label: 'Dry, kinky, thin', dosha: 'V' }, { label: 'Fine, oily, early grey', dosha: 'P' }, { label: 'Thick, oily, wavy, lustrous', dosha: 'K' }] },
  { id: 'q4', question: 'Appetite and digestion?', options: [{ label: 'Variable, irregular', dosha: 'V' }, { label: 'Strong, intense, cannot miss meals', dosha: 'P' }, { label: 'Steady, can skip meals', dosha: 'K' }] },
  { id: 'q5', question: 'Sleep pattern?', options: [{ label: 'Light, interrupted, less', dosha: 'V' }, { label: 'Moderate, sound', dosha: 'P' }, { label: 'Heavy, prolonged, difficult to wake', dosha: 'K' }] },
  { id: 'q6', question: 'Mental/emotional tendency?', options: [{ label: 'Anxious, quick, creative', dosha: 'V' }, { label: 'Sharp, focused, irritable', dosha: 'P' }, { label: 'Calm, steady, slow', dosha: 'K' }] },
  { id: 'q7', question: 'Memory and learning?', options: [{ label: 'Quick to learn, quick to forget', dosha: 'V' }, { label: 'Sharp, clear, precise', dosha: 'P' }, { label: 'Slow to learn, never forgets', dosha: 'K' }] },
  { id: 'q8', question: 'Weather preference?', options: [{ label: 'Dislikes cold, loves warmth', dosha: 'V' }, { label: 'Dislikes heat, loves cool', dosha: 'P' }, { label: 'Dislikes damp, loves dry warmth', dosha: 'K' }] },
  { id: 'q9', question: 'Exercise tolerance?', options: [{ label: 'Low, tires easily', dosha: 'V' }, { label: 'Moderate, competitive', dosha: 'P' }, { label: 'High, good endurance', dosha: 'K' }] },
  { id: 'q10', question: 'Speech pattern?', options: [{ label: 'Fast, talkative, jumps topics', dosha: 'V' }, { label: 'Sharp, precise, argumentative', dosha: 'P' }, { label: 'Slow, melodious, thoughtful', dosha: 'K' }] },
];

export function AyurvedaPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [formulations, setFormulations] = useState<Formulation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFormulations, setFilteredFormulations] = useState<Formulation[]>([]);
  const [selectedFormulation, setSelectedFormulation] = useState<Formulation | null>(null);
  const [activeTab, setActiveTab] = useState<'prakriti' | 'formulations'>('formulations');
  // Prakriti assessment state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ vata: number; pitta: number; kapha: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ayurvedaService.getFormulations().then(f => { setFormulations(f); setFilteredFormulations(f); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setFilteredFormulations(formulations); return; }
    ayurvedaService.searchFormulations(searchQuery).then(setFilteredFormulations);
  }, [searchQuery, formulations]);

  const handleAnswer = (qId: string, dosha: string) => {
    setAnswers(prev => ({ ...prev, [qId]: dosha }));
  };

  const calculatePrakriti = () => {
    const counts = { V: 0, P: 0, K: 0 };
    Object.values(answers).forEach(d => { counts[d as keyof typeof counts]++; });
    const total = PRAKRITI_QUESTIONS.length;
    setResult({ vata: Math.round(counts.V / total * 100), pitta: Math.round(counts.P / total * 100), kapha: Math.round(counts.K / total * 100) });
  };

  const answeredCount = Object.keys(answers).length;
  const dominant = result ? (result.vata >= result.pitta && result.vata >= result.kapha ? 'Vata' : result.pitta >= result.kapha ? 'Pitta' : 'Kapha') : null;

  if (loading) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        breadcrumbs={[{ label: 'Trials', onClick: () => navigate('/trials') }, { label: 'AYU-001', onClick: () => navigate(`/trials/${trialId}`) }, { label: 'Ayurveda' }]}
        title="Ayurveda"
        subtitle="Prakriti assessment, Dosha tracking & Formulation library"
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid var(--surta-green-100)' }}>
        {[{ key: 'formulations', label: 'Formulation Library' }, { key: 'prakriti', label: 'Prakriti Assessment Tool' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} style={{
            padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9375rem', fontFamily: 'var(--font-body)',
            color: activeTab === t.key ? 'var(--surta-green-900)' : 'var(--status-neutral)',
            borderBottom: `2px solid ${activeTab === t.key ? 'var(--surta-gold)' : 'transparent'}`,
            marginBottom: -2, transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'formulations' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <input className="form-input" placeholder="Search by name, indication, AFI code, category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ maxWidth: 480 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredFormulations.map(f => (
                <div key={f.id} className="surta-card" style={{ padding: '18px 20px', cursor: 'pointer', borderLeft: selectedFormulation?.id === f.id ? '4px solid var(--surta-gold)' : '4px solid transparent' }} onClick={() => setSelectedFormulation(f)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--surta-green-900)', marginBottom: 3 }}>{f.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--surta-green-500)', fontWeight: 600, marginBottom: 6 }}>{f.afiCode}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{f.indication.slice(0, 80)}...</div>
                    </div>
                    <span className="badge badge-dark">{f.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {f.rasa.map(r => <span key={r} className="badge badge-neutral">{r}</span>)}
                  </div>
                </div>
              ))}
            </div>

            {selectedFormulation && (
              <div className="surta-card" style={{ padding: 24, position: 'sticky', top: 84, height: 'fit-content' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--surta-green-900)', marginBottom: 4 }}>{selectedFormulation.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--surta-green-500)', fontWeight: 600, marginBottom: 12 }}>{selectedFormulation.afiCode}</div>
                <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>{selectedFormulation.description}</p>
                <LeafDivider label="Properties" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '0.875rem', marginBottom: 16 }}>
                  {[['Rasa', selectedFormulation.rasa.join(', ')], ['Guna', selectedFormulation.guna.join(', ')], ['Virya', selectedFormulation.virya], ['Vipaka', selectedFormulation.vipaka], ['Category', selectedFormulation.category]].map(([k, v]) => (
                    <div key={k}><div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{k}</div><div style={{ color: 'var(--surta-green-900)', fontWeight: 500 }}>{v}</div></div>
                  ))}
                </div>
                <LeafDivider label="Dosha Effect" />
                {[['Vata', selectedFormulation.doshaEffect.vata, 'var(--dosha-vata)'], ['Pitta', selectedFormulation.doshaEffect.pitta, 'var(--dosha-pitta)'], ['Kapha', selectedFormulation.doshaEffect.kapha, 'var(--dosha-kapha)']].map(([d, e, c]) => (
                  <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: c as string }}>{d}</span>
                    <span style={{ fontSize: '0.8125rem', padding: '2px 10px', borderRadius: 20, fontWeight: 600, background: e === 'Decreases' ? 'var(--surta-green-100)' : e === 'Increases' ? '#fde8e4' : '#f3f4f6', color: e === 'Decreases' ? 'var(--status-good)' : e === 'Increases' ? 'var(--status-critical)' : 'var(--status-neutral)' }}>{e}</span>
                  </div>
                ))}
                <LeafDivider label="Indication" />
                <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{selectedFormulation.indication}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prakriti' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          <div>
            <SectionHeading eyebrow="Assessment" title="Prakriti Questionnaire" subtitle="Answer all 10 questions to calculate dominant Prakriti" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PRAKRITI_QUESTIONS.map((q, i) => (
                <div key={q.id} className="surta-card" style={{ padding: '18px 20px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--surta-green-900)', marginBottom: 12 }}>
                    <span style={{ color: 'var(--surta-gold)', marginRight: 8 }}>Q{i + 1}.</span>{q.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.options.map(opt => (
                      <label key={opt.dosha} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: answers[q.id] === opt.dosha ? 'var(--surta-green-100)' : 'var(--surta-ivory)', border: `1.5px solid ${answers[q.id] === opt.dosha ? 'var(--surta-green-500)' : 'var(--surta-green-100)'}`, transition: 'all 0.15s' }}>
                        <input type="radio" name={q.id} value={opt.dosha} checked={answers[q.id] === opt.dosha} onChange={() => handleAnswer(q.id, opt.dosha)} style={{ accentColor: 'var(--surta-green-500)' }} />
                        <span style={{ fontSize: '0.9375rem', color: 'var(--surta-green-900)' }}>{opt.label}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700, color: opt.dosha === 'V' ? 'var(--dosha-vata)' : opt.dosha === 'P' ? 'var(--dosha-pitta)' : 'var(--dosha-kapha)' }}>{opt.dosha === 'V' ? 'Vata' : opt.dosha === 'P' ? 'Pitta' : 'Kapha'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-primary" disabled={answeredCount < PRAKRITI_QUESTIONS.length} onClick={calculatePrakriti} style={{ alignSelf: 'flex-start' }}>
                Calculate Prakriti ({answeredCount}/{PRAKRITI_QUESTIONS.length} answered)
              </button>
            </div>
          </div>

          {/* Result panel */}
          <div>
            <div className="surta-card" style={{ padding: 24, position: 'sticky', top: 84 }}>
              {result ? (
                <>
                  <SectionHeading eyebrow="Result" title="Prakriti Analysis" />
                  <div style={{ textAlign: 'center', padding: '16px 0 20px' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginBottom: 6 }}>Dominant Prakriti</div>
                    <div className={`badge badge-${dominant?.toLowerCase() as 'vata'|'pitta'|'kapha'}`} style={{ fontSize: '1.125rem', padding: '8px 20px' }}>{dominant?.toUpperCase()}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: 6, color: dominant === 'Vata' ? 'var(--dosha-vata)' : dominant === 'Pitta' ? 'var(--dosha-pitta)' : 'var(--dosha-kapha)' }}>
                      {Math.max(result.vata, result.pitta, result.kapha)}%
                    </div>
                  </div>
                  {[['Vata', result.vata, 'var(--dosha-vata)'], ['Pitta', result.pitta, 'var(--dosha-pitta)'], ['Kapha', result.kapha, 'var(--dosha-kapha)']].map(([d, v, c]) => (
                    <div key={d} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: c as string }}>{d}</span>
                        <span style={{ fontWeight: 700 }}>{v}%</span>
                      </div>
                      <div className="progress-track" style={{ height: 10 }}>
                        <div style={{ height: '100%', background: c as string, borderRadius: 5, width: `${v}%`, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>Save to Participant Record</button>
                </>
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>🌿</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--status-neutral)', marginBottom: 4 }}>{answeredCount}/{PRAKRITI_QUESTIONS.length} questions answered</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>Complete all questions to see the Prakriti result</div>
                  {answeredCount > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: `${(answeredCount / PRAKRITI_QUESTIONS.length) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
