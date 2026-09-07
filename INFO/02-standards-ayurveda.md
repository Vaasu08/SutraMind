# Clinical Standards and Ayurveda Data Strategy

## What each standard covers

| Standard/source | Ayurveda clinical concepts (Prakriti, Agni, etc.) | Ayurveda medicines | Correct Phase 1 use |
| --- | --- | --- | --- |
| MedDRA | No | No | Do not implement in Phase 1; later use for adverse-event coding. |
| WHODrug | No | Yes, where an ASU&H product is a registered product represented in the dictionary | Keep a future external-code field; do not claim a WHODrug code unless validated/licensed data is available. |
| Ayurvedic Formulary / API | Yes | Yes | Domain reference for the internal Ayurveda master dictionary and formulation records. |
| SURTAMIND Ayurveda Master Dictionary | Yes | Yes, for the selected prototype scope | Phase 1 controlled vocabulary used by application fields. |

## Important distinction

Ayurveda clinical terminology and Ayurveda medicinal-product terminology are different data domains.

- MedDRA is a global terminology for diseases, symptoms, diagnoses, and adverse events. It does **not** provide Ayurveda concepts or medicine names.
- WHODrug is a medicinal-product dictionary. It may represent registered Ayurvedic/ASU&H products, but it does **not** define concepts such as Prakriti, Vikriti, Agni, Bala, or Satva.
- SURTAMIND must therefore own an Ayurveda clinical observation schema and use global codes only where appropriate.

## Phase 1 Ayurveda implementation

### Study/protocol metadata

Every Ayurveda study records controlled values for:

- Vyadhi and its modern diagnosis mapping
- intervention/formulation
- dosage form
- Anupana
- treatment duration

### Participant baseline

Enrollment captures:

- Prakriti
- Vikriti notes
- Agni
- Bala
- Satva

### Visit CRF assessment

Each completed visit records current Agni, Bala, symptoms, treatment/formulation, dose, frequency, compliance, clinical vitals, and PI/coordinator remarks.

### Reporting

The dashboard reports Prakriti distribution, Vyadhi distribution, medicine adherence, recruitment, visit completion, and ethics state. This is intentionally an Ayurveda research dashboard rather than a generic hospital dashboard.

## Controlled vocabulary rules

1. Persist the **code** (for example `P6`), not the translated label (for example `Vata-Kapha`).
2. Render the English, Hindi, and Sanskrit/transliterated display labels from the dictionary.
3. Allow an administrator to deactivate a term, never delete a term referenced by a study record.
4. Let a study choose only active, protocol-compatible interventions and dosage forms.
5. Keep a free-text `vikriti_notes`, `symptoms`, and `remarks` field only when a controlled vocabulary would erase clinically relevant nuance.

## Future interoperability fields

These nullable fields may be present in the model but are not populated by Phase 1 screens:

| Entity | Future field | Phase |
| --- | --- | --- |
| Medicine | `whodrug_code`, `whodrug_version` | Phase 3 integration after licensed/validated source access. |
| Adverse event | `meddra_code`, `meddra_version` | Phase 3; the adverse-event entity itself starts in Phase 2. |
| Diagnosis | FHIR/standard coding reference | Phase 3. |

No screen should pretend that a local Ayurveda term is a MedDRA or WHODrug code.
