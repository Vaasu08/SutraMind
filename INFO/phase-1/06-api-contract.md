# Phase 1 API Contract

Base path: `/api/v1`. All endpoints except login require `Authorization: Bearer <JWT>`.

## Common conventions

- IDs are UUIDs in API routes; human-readable `study_code` and `participant_code` are separate fields.
- List endpoints accept `page`, `page_size` (default 20, maximum 100), and relevant study/status filters.
- Responses return `{ "data": ..., "meta": ... }`; errors return `{ "error": { "code": "...", "message": "...", "fields": {...} } }`.
- `401` means no/invalid token, `403` means authenticated but unauthorized, `404` means record is absent or outside scope, `409` means state/uniqueness conflict, and `422` means invalid payload.
- UI display labels are translated client-side from a code/dictionary response. API requests persist codes.

## Core workflow endpoints

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Validate credentials and return JWT + user summary. |
| GET | `/auth/me` | Authenticated | Return active user/role/study assignments. |
| GET | `/studies` | Scoped | List accessible studies. |
| POST | `/studies` | Admin, PI | Create draft study and initial protocol/ethics metadata. |
| GET | `/studies/{study_id}` | Scoped | Detail including protocol, sites, ethics, KPI summary. |
| PATCH | `/studies/{study_id}` | PI owner, Admin | Update permitted study fields/state. |
| GET | `/participants` | Scoped | Filtered registry list; no PII in default list projection. |
| POST | `/participants` | Assigned Coordinator | Create participant and baseline as one transaction. |
| GET | `/participants/{participant_id}` | Scoped | Participant profile, baseline, visits, and query count. |
| PATCH | `/participants/{participant_id}` | Coordinator/PI under lifecycle rules | Amend draft/approved fields permitted in Phase 1. |
| POST | `/visits` | Assigned Coordinator | Schedule a participant visit. |
| PATCH | `/visits/{visit_id}` | Assigned Coordinator | Update scheduled/missed metadata; complete only through CRF flow. |
| POST | `/crfs` | Assigned Coordinator | Create a draft or completed CRF for a visit. |
| GET | `/crfs/by-visit/{visit_id}` | Scoped | Get CRF form data for one visit. |
| PATCH | `/crfs/{crf_id}` | Assigned Coordinator | Save draft or complete a CRF after validation. |
| GET | `/queries` | Scoped | List queries filtered by study/status/target. |
| POST | `/queries` | Monitor | Raise an `OPEN` field/record query. |
| PATCH | `/queries/{query_id}` | Coordinator/PI under state rules | Answer (Coordinator/PI) or close (PI). |

The source notes describe these as 13 APIs, but the named routes total 18 here because Phase 1 needs explicit `PATCH` updates for the stated features. The UI can still demonstrate the original minimum flows using the 13 most-visible operations; the complete contract should not omit necessary behaviour.

## Supporting endpoints

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/master-terms` | Authenticated | Return active terms by category for dropdowns. |
| POST | `/master-terms` | Admin | Add a controlled term. |
| PATCH | `/master-terms/{term_id}` | Admin | Correct label/order or deactivate a term. |
| GET | `/dashboard/studies/{study_id}` | Scoped | Return recruitment, visits, queries, adherence, Ayurveda distributions, ethics state. |
| PATCH | `/ethics/{study_id}` | Assigned Ethics user | Update current IEC state/dates/remarks. |

## Important payload shapes

### Create study

```json
{
  "study_code": "AMAVATA-001",
  "title": "Yogaraja Guggulu in Amavata",
  "institution": "Demo Ayurveda Institute",
  "sample_size": 120,
  "start_date": "2026-09-15",
  "end_date": "2027-03-15",
  "protocol": {
    "version": "1.0",
    "modern_diagnosis": "Rheumatoid Arthritis",
    "vyadhi_code": "V001",
    "medicine_id": "<uuid>",
    "dosage_form_code": "DF01",
    "anupana_code": "AN01",
    "treatment_duration_days": 90
  },
  "ethics": { "iec_number": "IEC/DEMO/001", "status": "PENDING" }
}
```

### Enrol participant with baseline

```json
{
  "participant_code": "AMV-001",
  "site_id": "<uuid>",
  "name": "Demo Participant 001",
  "age": 42,
  "gender": "FEMALE",
  "modern_diagnosis": "Rheumatoid Arthritis",
  "vyadhi_code": "V001",
  "disease_duration_months": 24,
  "randomization_id": "R-001",
  "enrollment_date": "2026-09-16",
  "baseline": {
    "prakriti_code": "P6",
    "agni_code": "A2",
    "bala_code": "B2",
    "satva_code": "S2",
    "vikriti_notes": "Demo record only"
  }
}
```

### Complete CRF

```json
{
  "visit_id": "<uuid>",
  "visit_date": "2026-10-16",
  "investigator_id": "<uuid>",
  "systolic_bp": 118,
  "diastolic_bp": 76,
  "pulse_bpm": 72,
  "weight_kg": 58.4,
  "temperature_c": 36.8,
  "agni_code": "A1",
  "bala_code": "B2",
  "symptoms": "Morning stiffness reduced.",
  "medicine_id": "<uuid>",
  "dose": "500 mg",
  "frequency": "BD",
  "compliance": "YES",
  "completion_status": "COMPLETED"
}
```

## API acceptance checks

- A Coordinator token cannot post a study or modify ethics.
- An Ethics token cannot retrieve a participant profile.
- A Monitor can create a query but gets `403` when trying to edit a CRF.
- Duplicate participant code within the same study returns `409`.
- A second CRF on one visit returns `409`.
- A CRF marked `COMPLETED` without required Ayurveda/treatment/vitals fields returns `422`.
- A PI can close an answered query but not an open query.
