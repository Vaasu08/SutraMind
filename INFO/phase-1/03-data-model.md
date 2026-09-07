# Phase 1 Data Model

## Relationship map

```text
User --< StudyMembership >-- Study --< Site
                                  |--< Protocol (one active version)
                                  |--< EthicsReview
                                  |--< Participant --1 AyurvedaBaseline
                                  |                  |--< Visit --1 CRF --< Query target
                                  |--< Milestone
MasterTerm -- referenced by Protocol, Baseline, CRF, and Medicine
Medicine -- referenced by Protocol and CRF
```

`StudyMembership` is required even though it was not named in the initial 11-table outline: role alone cannot determine which studies and sites a non-admin user may access.

## Transactional tables

### 1. `users`

| Field | Notes |
| --- | --- |
| `id UUID PK` | Internal identity. |
| `name`, `email` | Email is unique, lowercase-normalised. |
| `password_hash` | Never returned by API. |
| `role` | `ADMIN`, `PI`, `COORDINATOR`, `MONITOR`, `ETHICS`, `PV`. |
| `is_active`, `created_at` | Blocks login without deleting history. |

### 2. `studies`

`id`, `study_code` (unique), `title`, `pi_id -> users`, `institution`, `sample_size`, `start_date`, `end_date`, `status` (`DRAFT|ACTIVE|CLOSED`), `created_at`, `updated_at`.

Constraint: `end_date >= start_date`; only an Admin or PI creates a study; a PI may create only a study assigned to their own identity.

### 3. `study_memberships`

`id`, `study_id`, `user_id`, `site_id nullable`, `role_in_study`, `is_active`.

Unique `(study_id, user_id, site_id)`. An Admin can assign members. A PI is implicitly linked by `studies.pi_id` and may also have an explicit membership for list filtering. A Coordinator with a site assignment may enrol only at that site.

### 4. `sites`

`id`, `study_id`, `site_code`, `name`, `address`, `is_active`.

Unique `(study_id, site_code)`. A Phase 1 study supports one or more sites; this protects the design from a later multi-centre rewrite.

### 5. `protocols`

`id`, `study_id`, `version`, `is_active`, `modern_diagnosis`, `vyadhi_code`, `intervention_name`, `medicine_id nullable`, `dosage_form_code`, `anupana_code`, `treatment_duration_days`, `created_by`, `created_at`.

Unique `(study_id, version)` and partial unique `(study_id) where is_active`. When a new version activates, the previous version becomes read-only/inactive. Phase 1 does not implement protocol-amendment approval flow.

### 6. `ethics_reviews`

`id`, `study_id`, `iec_number`, `status` (`PENDING|SUBMITTED|APPROVED|REJECTED|EXPIRED`), `approval_date nullable`, `expiry_date nullable`, `remarks`, `updated_by`, `updated_at`.

One current review per study in the MVP; retain the table boundary so a version/history table can be added in Phase 2.

### 7. `medicines`

`id`, `medicine_code` (unique), `ayurveda_name`, `dosage_form_code`, `whodrug_code nullable`, `is_active`, `created_at`.

Seed prototype formulation: `MED001 / Yogaraja Guggulu / DF01`. A WHODrug code is nullable and may not be fabricated.

### 8. `participants`

`id`, `participant_code`, `study_id`, `site_id`, `name`, `age`, `gender`, `modern_diagnosis`, `vyadhi_code`, `disease_duration_months`, `randomization_id`, `enrollment_date`, `status`, `created_by`.

Unique `(study_id, participant_code)` and `(study_id, randomization_id)` when a randomisation value exists. Status: `DRAFT`, `SUBMITTED`, `ENROLLED`, `COMPLETED`, `WITHDRAWN`. Enrollment is limited by the study target as described in scope.

### 9. `ayurveda_baselines` (the source draft's `prakriti` table)

`id`, `participant_id` (unique), `prakriti_code`, `vikriti_notes`, `agni_code`, `bala_code`, `satva_code`, `recorded_by`, `recorded_at`.

This is a study-specific baseline because a participant's recorded assessment belongs to that trial context.

### 10. `visits`

`id`, `participant_id`, `visit_number`, `visit_date`, `scheduled_date`, `next_visit_date`, `status`, `investigator_id`, `created_by`, `updated_at`.

Unique `(participant_id, visit_number)`. Status: `SCHEDULED`, `COMPLETED`, `MISSED`. `visit_number = 0` is permitted for baseline if the study uses a baseline visit; subsequent visits are positive integers.

### 11. `crfs`

`id`, `visit_id` (unique), `systolic_bp`, `diastolic_bp`, `pulse_bpm`, `weight_kg`, `temperature_c`, `agni_code`, `bala_code`, `symptoms`, `medicine_id`, `dose`, `frequency`, `compliance`, `remarks`, `completion_status`, `completed_by`, `completed_at`.

One visit has one CRF. `completion_status` is `DRAFT|COMPLETED`; a completed CRF requires a completed visit. The CRF does not contain AE/SAE fields in Phase 1.

### 12. `queries`

`id`, `study_id`, `target_type` (`PARTICIPANT|BASELINE|VISIT|CRF`), `target_id`, `field_name nullable`, `message`, `status`, `raised_by`, `raised_at`, `answer nullable`, `answered_by nullable`, `answered_at nullable`, `closed_by nullable`, `closed_at nullable`.

Status: `OPEN`, `ANSWERED`, `CLOSED`. Validate that the target is part of the selected study. Do not permit a closed query to be edited.

### 13. `milestones`

`id`, `study_id`, `name`, `target_date`, `target_count nullable`, `actual_count nullable`, `status`.

Use it for recruitment targets and demo timeline indicators. The primary recruitment KPI derives from `participants`, not manually entered milestone counts.

## Reference table: `master_terms`

Use one extensible table rather than hard-coding values in React or database enums:

`id`, `category`, `code`, `label_en`, `label_hi`, `modern_mapping_en nullable`, `active`, `sort_order`, `created_at`.

Unique `(category, code)`. Seed it from [the dictionary JSON](../reference-data/ayurveda-master-dictionary.json). Required categories: `vyadhi`, `prakriti`, `agni`, `dosage_form`, `anupana`, `bala`, `satva`.

## Referential and state rules

| Rule | Enforcement location |
| --- | --- |
| Codes used in clinical records must point to an active dictionary term at time of entry. | Service validation + foreign-key/reference check. |
| Historical record continues to display if term later deactivates. | Dictionary lookup includes inactive referenced code. |
| Participant site must belong to participant study. | Database/service validation. |
| Coordinator may create participant only for assigned study/site. | RBAC service. |
| Participant cannot enroll beyond study sample size without PI-approved override. | Enrollment transaction/service. |
| One active protocol per study. | Database partial unique index/transaction. |
| One baseline per participant and one CRF per visit. | Unique constraints. |
| Query's target must lie within its study. | Service lookup before write. |

## Reporting derivations

| KPI | Formula |
| --- | --- |
| Recruitment | `count(participants where status in SUBMITTED, ENROLLED, COMPLETED) / studies.sample_size` (show enrolled count separately). |
| Visit completion | `completed visits / all scheduled-or-completed-or-missed visits`, excluding cancelled visits because Phase 1 has none. |
| Prakriti distribution | Group enrolled-participant baselines by `prakriti_code`. |
| Vyadhi distribution | Group enrolled participants by `vyadhi_code`. |
| Medicine adherence | `count(completed CRFs with compliance=YES) / count(completed CRFs with non-null compliance)`. |
| Ethics state | Current `ethics_reviews.status` for selected study. |

All charts label categories through the active UI language, but aggregate using stable codes.
