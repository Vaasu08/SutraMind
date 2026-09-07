# Digital CRF and Validation Specification

## Why the CRF is essential

A Case Report Form (CRF) is the structured record of clinical observations collected during a trial visit. The digital CRF is the central evidence-capture screen in SURTAMIND; without it, the app is a registry, not a CTMS/EDC prototype.

## One CRF per visit

- A `Visit` establishes when and which participant interaction happened.
- A `CRF` stores the structured findings from that interaction.
- A visit may have one draft or completed CRF only.
- A CRF is edited by the Coordinator while draft; its fields are viewable by PI and Monitor.
- Completing the CRF changes the visit to `COMPLETED` in the same transaction.

## Form layout

### A. Visit information

| Field | Required | Rule |
| --- | --- | --- |
| Participant code | Display-only | Derived from visit; never manually selectable inside a CRF. |
| Visit number | Display-only | Derived from visit. |
| Visit date | Yes | Cannot be before enrollment date; flag date in future. |
| Investigator | Yes | Assigned PI/Coordinator user. |
| Next visit date | No | Must be later than visit date when present. |

### B. Vitals

| Field | Required to complete | Format | Soft plausibility range |
| --- | --- | --- |
| Systolic BP | Yes | whole number, mmHg | 50–250 |
| Diastolic BP | Yes | whole number, mmHg | 30–150 and lower than systolic |
| Pulse | Yes | whole number, bpm | 25–250 |
| Weight | Yes | decimal, kg | 1–300 |
| Temperature | No | decimal, °C | 30–45 |

Out-of-range values show a confirmation warning and may lead to a Monitor query; the UI must not silently change clinical data.

### C. Ayurveda assessment

| Field | Required to complete | Input |
| --- | --- | --- |
| Agni | Yes | Active `agni` master-term dropdown. |
| Bala | Yes | Active `bala` master-term dropdown. |
| Symptoms | Yes | Clinically meaningful free text, max 2,000 characters. |
| Ayurveda/PI notes | No | Free text, max 2,000 characters. |

Baseline-only fields (Prakriti, Vikriti, Satva) appear on enrollment/baseline. The participant profile renders them next to the current-visit assessment so researchers can compare without overwriting baseline data.

### D. Treatment and compliance

| Field | Required to complete | Rule |
| --- | --- | --- |
| Formulation | Yes | Medicine selected from active master; default from active protocol but editable only to a compatible medicine. |
| Dose | Yes | Human-readable numeric/unit string, max 100 characters. |
| Frequency | Yes | Controlled options such as OD/BD/TDS or an approved text option. |
| Compliance | Yes | `YES`, `NO`, or `PARTIAL`; dashboard adherence counts `YES`. |
| Remarks | No | Max 2,000 characters. |

## Validation behaviour

| Layer | Responsibility |
| --- | --- |
| React form | Required field markers, type validation, accessible inline messages, date/order hints. |
| FastAPI/Pydantic | Reject malformed values and missing required complete-CRF fields with `422`. |
| Service layer | Validate study/site access, visit state, protocol/medicine compatibility, and lifecycle transitions. |
| PostgreSQL | Enforce unique CRF-per-visit, foreign keys, check constraints, and non-null data where appropriate. |

## Baseline enrollment form

The participant-enrollment form has four sections and is saved atomically:

| Section | Required data |
| --- | --- |
| Demographics | Participant ID/code, name, age, gender. |
| Clinical | Modern diagnosis, Vyadhi, disease duration. |
| Ayurveda baseline | Prakriti, Agni, Bala, Satva, Vikriti notes. |
| Trial | Randomisation ID, enrollment date, assigned site. |

## What the CRF deliberately does not do in Phase 1

- It does not capture adverse events, serious adverse events, causality, or MedDRA codes.
- It does not produce an electronic signature, locked record, source-document upload, or audit history.
- It does not generate visit schedules automatically from the protocol.

These are explicit next-phase capabilities, not missing fields to improvise during the demo.
