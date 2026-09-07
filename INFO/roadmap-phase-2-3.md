# Phased Roadmap Beyond Phase 1

## Phase 1 — Core Ayurveda CTMS (now)

Deliver the complete online workflow: authentication/RBAC, study/protocol/ethics setup, participants, Ayurveda baseline, visit CRFs, data queries, dashboard KPIs, and Hindi/English interface.

The architectural foundations carried forward are PostgreSQL identifiers, master-term codes, protocol versioning, scoped memberships, and typed API contracts.

## Phase 2 — Field operation and clinical safety

| Feature | Extension approach |
| --- | --- |
| Offline Windows app | Build a desktop client with an explicit sync queue and conflict model; do not simply copy server tables to SQLite. |
| SQLite sync | Assign UUIDs client-side, record operation timestamps, reconcile server-side, and expose conflict review. |
| Audit trail | Add append-only event records with actor, timestamp, entity, previous/new values, reason, and hash/immutability strategy. |
| AE/SAE | Add `adverse_events`, seriousness, onset/end dates, causality, outcome, medical review, and PV workflow. |
| Panchakarma | Model prescribed procedure, session, practitioner, observations, and compliance as linked trial events. |

Phase 2 must not replace Phase 1 baseline/CRF tables. It extends them with durable history and field-operation capabilities.

## Phase 3 — Interoperability and intelligence

| Feature | Extension approach |
| --- | --- |
| FHIR | Define validated mappings from study/participant/observations to selected FHIR resources; do not expose raw database schema as FHIR. |
| CDISC / SDTM | Map stable CRF data to CDISC domains after protocol/CRF design is frozen. |
| MedDRA coding | Code Phase 2 AE/SAE terms using licensed/versioned MedDRA data; store version and coding decisions. |
| WHODrug linkage | Link registered medicinal products where applicable; keep Ayurveda formulation identity separately. |
| AI insights | Add only after governed, sufficiently complete data exists; require explainability, role controls, and no autonomous clinical decision-making. |

## Architectural guardrails for the roadmap

- Use stable UUIDs and controlled vocabulary codes from Phase 1, so external mappings do not change clinical history.
- Keep audit data separate from current-state tables; audit writes must not be editable through ordinary CRUD routes.
- Treat terminology dictionaries as versioned licensed assets when using MedDRA/WHODrug, not as copied free-text lists.
- Never use AI output as a medical recommendation or substitute for PI review.
