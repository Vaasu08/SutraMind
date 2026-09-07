# SURTAMIND Information Base

This folder is the canonical, implementation-ready record for the SURTAMIND SIH solution: an Ayurveda-native Clinical Trial Management System (CTMS).

## Product in one sentence

SURTAMIND helps Ayurveda clinical-research teams run a controlled clinical trial from study setup through participant visits and data-query resolution, while preserving Ayurveda observations as first-class structured data and remaining ready for international interoperability.

## What is in this folder

| Location | Purpose |
| --- | --- |
| [01-product-domain.md](01-product-domain.md) | Product goal, users, clinical boundary, and terminology decisions. |
| [02-standards-ayurveda.md](02-standards-ayurveda.md) | MedDRA, WHODrug, and Ayurveda terminology strategy. |
| [phase-1/01-scope-success.md](phase-1/01-scope-success.md) | Phase 1 scope, success criteria, exclusions, and delivery decisions. |
| [phase-1/02-architecture.md](phase-1/02-architecture.md) | Stack, components, security, deployment, and folder layout. |
| [phase-1/03-data-model.md](phase-1/03-data-model.md) | Entities, relationships, constraints, controlled terms, and seed data. |
| [phase-1/04-rbac-workflows.md](phase-1/04-rbac-workflows.md) | Roles, backend permissions, lifecycle states, and clinical workflows. |
| [phase-1/05-crf-validation.md](phase-1/05-crf-validation.md) | Digital CRF structure and validation rules. |
| [phase-1/06-api-contract.md](phase-1/06-api-contract.md) | REST API surface, payload rules, errors, and access controls. |
| [phase-1/07-prototype-spec.md](phase-1/07-prototype-spec.md) | Required screens, interactions, demo data, and judge walkthrough. |
| [phase-1/08-execution-plan.md](phase-1/08-execution-plan.md) | Immediate 14-day build plan, acceptance tests, and release checklist. |
| [phase-1/09-local-ui-execution-playbook.md](phase-1/09-local-ui-execution-playbook.md) | Beginner-safe local build sequence, Ayurvedic UI system, reference-asset use, and screen-by-screen implementation gates. |
| [roadmap-phase-2-3.md](roadmap-phase-2-3.md) | Deferred features and extension path. |
| [reference-data/ayurveda-master-dictionary.json](reference-data/ayurveda-master-dictionary.json) | Machine-readable Phase 1 controlled vocabulary seed. |

## Canonical Phase 1 decisions

- **Build target:** a responsive web MVP, not an offline desktop app.
- **Clinical focus:** Ayurveda trial setup, participant registry, Ayurveda baseline, visits/CRFs, query workflow, recruitment KPIs, and Hindi/English UI.
- **Source of truth for terminology:** store stable internal codes, not translated display labels or uncontrolled text.
- **Backend authority:** FastAPI authenticates every request and enforces permissions; the React UI is never a security boundary.
- **Sensitive data:** use participant codes on listings, charts, and demo projections. Do not use real patient data in the SIH demo.
- **Phase 1 does not implement:** offline sync, immutable audit trail, AE/SAE capture, Panchakarma, FHIR, CDISC/SDTM, AI, or MedDRA coding.

## Requirement reconciliations

The supplied Phase 1 notes contain a few arithmetic and modelling conflicts. They are resolved below rather than silently carried into implementation.

| Supplied note | Canonical decision | Reason |
| --- | --- | --- |
| "11 tables" does not include the later-required `crfs` table or access assignments. | Use 13 transactional tables plus one generic master-terms table. | CRFs and scoped study access are required for a real Phase 1 workflow. |
| The listed endpoint groups add up to 16, although the note says 13; the earlier sketch says 9. | Expose 16 core workflow endpoints plus 4 small supporting endpoints. | The number must not remove study detail, CRF retrieval, or logged-in identity. |
| Early permission table lets PI edit many records; later workflow assigns enrollment/CRFs to the Coordinator. | Coordinator enters operational data; PI reviews/approves and can close queries. | Clear separation gives a more credible CTMS workflow. |
| A `prakriti` table is named after only one part of the baseline. | Use `ayurveda_baselines` (documented alias: `prakriti`). | It stores Prakriti, Vikriti, Agni, Bala, and Satva together. |

These decisions preserve every requested feature while preventing incomplete or inconsistent implementation.
