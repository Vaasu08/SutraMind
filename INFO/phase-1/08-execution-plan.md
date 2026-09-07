# Immediate Phase 1 Execution Plan

## Delivery sequence

Target duration: **14 working days** for a small SIH team. If time is shorter, preserve the end-to-end demo path first and reduce only visual polish/secondary admin flows.

## Day 0: repository and ownership

- Create `frontend/`, `backend/`, `database/`, `docs/`, and retain this `INFO/` directory as the product baseline.
- Add `.env.example`, linting/formatting, pre-commit or CI checks, README startup guide, and issue board.
- Assign a primary owner for frontend, backend/database, Ayurveda master data/domain review, and QA/demo. Every member reviews the data model together.
- Create synthetic demo accounts and declare that no real patient information is used.

## Sprint 1 — Foundation (Days 1–3)

| Day | Build | Verify |
| --- | --- | --- |
| 1 | Scaffold React/Vite/TS/Tailwind and FastAPI; start PostgreSQL; configure Alembic. | Frontend and `/docs` OpenAPI page run locally; migration applies to blank DB. |
| 2 | Implement users, JWT login, password hashing, roles, protected route/dependency. | Each demo account logs in; inactive user and wrong password are denied. |
| 3 | Implement `master_terms`, medicine seed, English/Hindi i18next, admin dictionary list. | Language toggles instantly; UI renders dictionary code with both translated labels. |

## Sprint 2 — Study setup (Days 4–6)

| Day | Build | Verify |
| --- | --- | --- |
| 4 | Models/migrations for studies, memberships, sites, protocols, ethics. | Foreign-key and unique constraints fail safely on invalid setup. |
| 5 | Study create/detail API + PI/Admin UI with protocol tabs. | PI creates `AMAVATA-001`; Coordinator request returns 403. |
| 6 | Site assignment and ethics update flow; basic dashboard shell. | Ethics user changes IEC state but cannot see participants. |

## Sprint 3 — Participant and CRF core (Days 7–10)

| Day | Build | Verify |
| --- | --- | --- |
| 7 | Participant/baseline transaction, registry, profile APIs. | Duplicate code and unassigned-site enrollment are rejected. |
| 8 | Enrollment/profile UI with Ayurveda controlled fields. | Coordinator completes all four enrollment sections; PI sees submitted record. |
| 9 | Visits model/routes and timeline UI. | Coordinator schedules, misses, and filters visits within scope. |
| 10 | CRF model/routes, validation, draft/complete form. | Completed CRF updates visit and rejects missing required fields. |

## Sprint 4 — Query, reporting, polish (Days 11–14)

| Day | Build | Verify |
| --- | --- | --- |
| 11 | Query model/routes/UI and lifecycle permissions. | Monitor raises; Coordinator answers; PI closes; invalid transitions fail. |
| 12 | KPI aggregation endpoint and charts/cards. | Each seeded/event-created record changes the right KPI. |
| 13 | RBAC/API tests, form validation tests, responsive and Hindi visual QA. | Permission matrix tested with real tokens; 390px and Hindi forms are usable. |
| 14 | Seed/reset script, five-minute judge demo rehearsal, bug triage, deployment runbook. | Fresh environment can run end-to-end without manual DB edits. |

## Implementation order inside each feature

For Study, Participant, Visit/CRF, and Query modules, use this fixed order:

1. Add model and Alembic migration.
2. Add Pydantic create/read/update schemas.
3. Add service methods containing state and scope rules.
4. Add protected router endpoints and API tests.
5. Add typed frontend API client and route.
6. Add form/list/detail UI with translation keys.
7. Exercise the cross-role workflow in a seeded database.

This avoids building screens that cannot persist real clinical workflow.

## Team skill matrix

| Role | Needs to learn/use | Deliverable |
| --- | --- | --- |
| Frontend | React, TypeScript, Tailwind, React Router, i18next | Responsive role-aware pages and validated forms. |
| Backend | FastAPI, Pydantic, JWT, RBAC | Secure typed APIs and workflow services. |
| Database | PostgreSQL, SQLAlchemy, Alembic | Schema, constraints, seeds, reporting queries. |
| Ayurveda/domain | Ayurveda CTMS workflow and formulation terminology | Reviewed master dictionary, CRF labels, demo study. |
| UI/UX | Clinical form usability and bilingual layouts | Hindi/English interface and accessible form states. |
| QA | API, workflow, permissions, demo testing | Acceptance evidence and test checklist. |

## Test plan

### Automated

- Authentication: successful/failed/inactive token scenarios.
- RBAC: every prohibited matrix action returns `403`.
- Data constraints: duplicates, wrong study/site relation, one baseline/CRF, target limit.
- Workflows: all allowed/forbidden status transitions.
- KPI calculations using a deterministic seed dataset.

### Manual clinical workflow QA

- Enroll a participant and make sure baseline fields are preserved after a later CRF.
- Complete a CRF and confirm treatment compliance affects only the adherence KPI.
- Raise/answer/close a query as three different roles.
- Change language from either login or in-app view; check Hindi form labels and status chips.
- Ensure participant names do not occur in dashboard charts or recruitment cards.

## Release checklist

- [ ] Alembic migration applies from zero to latest.
- [ ] Seed command creates dictionaries, medicine, roles, study, participant, visit, and query demo data.
- [ ] All six roles have verified scoped access.
- [ ] Dashboard values come from database aggregates, not fixed UI numbers.
- [ ] English and Hindi keys have no missing-key rendering.
- [ ] Environment variables and local passwords are not committed.
- [ ] A fresh judge-demo walkthrough passes in under five minutes.
- [ ] Phase 1 exclusions are documented honestly in the demo slide/readme.
