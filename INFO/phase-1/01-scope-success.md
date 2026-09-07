# Phase 1 Scope and Success Criteria

## Objective

Build a fully working, production-like Ayurveda CTMS MVP. A user can securely run the core trial workflow in Hindi or English: create a study, configure its protocol and ethics state, enrol participants, record an Ayurveda baseline, conduct visit CRFs, manage data queries, and monitor Ayurveda-relevant KPIs.

## Judge-ready success path

Phase 1 is complete only when a judge can do all of the following with seeded demo accounts:

1. Log in as PI, Coordinator, Monitor, or Ethics user.
2. Create an Ayurveda clinical trial with protocol and ethics information.
3. Add or select its site, intervention, dosage form, Anupana, and treatment duration.
4. Enrol a participant under the study target and selected site.
5. Record Prakriti, Agni, Bala, Satva, and Vikriti notes at baseline.
6. Schedule and complete a visit using a digital CRF.
7. Have a Monitor raise a field-specific data query and a Coordinator answer it; have the PI close it.
8. Switch the software between English and Hindi without changing the stored data.
9. View recruitment, visit completion, Ayurveda distribution/adherence, and ethics KPIs.

## Included modules

| Module | Minimum Phase 1 capability |
| --- | --- |
| Authentication and RBAC | JWT login, six roles, backend-enforced permissions, active/inactive users. |
| Study management | Study list/create/detail, PI, institution, dates, target, status, site. |
| Protocol | Versioned protocol metadata including Vyadhi, modern diagnosis, intervention, dosage form, Anupana, and treatment duration. |
| Ethics | IEC number and status, editable by the Ethics role only. |
| Participant registry | Participant code, demographics, diagnosis, site, randomisation ID, enrollment status/date. |
| Ayurveda assessment | Structured baseline and current visit observations. |
| Visit and CRF | Schedule/complete/miss status and one electronic CRF per visit. |
| Data queries | Open, answer, review/close workflow with target record and field. |
| Dashboard | Recruitment, visit, query, ethics, Prakriti, Vyadhi, and adherence metrics. |
| Bilingual UX | English/Hindi language toggle, translated UI and master labels. |

## Explicit Phase 1 exclusions

| Feature | Deferred phase | Why it is deferred |
| --- | --- | --- |
| Offline Windows app and SQLite synchronisation | Phase 2 | Requires conflict resolution and device-level data design. |
| Immutable audit trail | Phase 2 | Regulatory-grade event capture should be designed as a coherent feature. |
| AE/SAE and pharmacovigilance cases | Phase 2 | Safety workflow needs dedicated forms, triage, and reporting rules. |
| Panchakarma module | Phase 2 | Needs its own procedure/session data model. |
| FHIR integration | Phase 3 | Interoperability is not needed to validate the core workflow. |
| CDISC export / SDTM | Phase 3 | Depends on stable CRF and mapping design. |
| AI insights | Phase 3 | Needs reliable, governed data first. |
| MedDRA coding | Phase 3 | Starts only with the AE data model and proper terminology access. |

## Required operational limits

These limits keep the MVP predictable and prevent misleading demo behaviour.

| Rule | Phase 1 limit/behaviour |
| --- | --- |
| Study code | Unique, uppercase slug, 3–30 characters; cannot change after activation. |
| Sample size | Positive integer; no enrollment beyond target without PI confirmation. |
| Participant code | Unique within a study; code is used in all dashboard output. |
| Participant personal data | Name is restricted to authorised study staff; no name in metrics/export/demo screenshots. |
| Protocol | Exactly one active protocol version per study; historical versions remain read-only. |
| Baseline | One baseline per participant/study; a correction is a controlled update in Phase 1, audit trail follows in Phase 2. |
| Visits | `visit_number` is unique per participant; one CRF per visit. |
| CRF | Cannot be marked completed until mandatory fields validate. |
| Queries | Must reference a study and a target entity/field; cannot be closed before an answer exists. |
| Dictionaries | Admin may add/deactivate a term; referenced terms are never deleted. |

## Definition of done

The Phase 1 prototype is done when every success-path action persists to PostgreSQL, honours role restrictions at the API, survives refresh/re-login, is visible in the appropriate dashboard calculation, and works with English/Hindi labels.
