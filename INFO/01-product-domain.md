# Product and Domain Definition

## Problem being solved

Ayurveda clinical studies need normal CTMS/EDC workflow—study configuration, ethics tracking, enrollment, visit records, data-quality queries, and recruitment visibility—without forcing Ayurveda observations into unstructured notes. Generic clinical systems do not model concepts such as **Prakriti**, **Vikriti**, **Agni**, **Bala**, **Satva**, **Vyadhi**, dosage form, or **Anupana** as structured research data.

SURTAMIND is an Ayurveda-native CTMS that makes these observations controlled, reportable fields while leaving a clean path to global coding standards later.

## Primary Phase 1 users

| User | Core outcome in Phase 1 |
| --- | --- |
| Admin | Create users, assign access, manage controlled vocabulary, and see all studies. |
| Principal Investigator (PI) | Set up a study and protocol, oversee enrollment and recruitment, review/close queries. |
| Study Coordinator | Enroll participants, capture baseline and visit CRFs, schedule visits, respond to queries. |
| Monitor | Review submitted CRFs and raise data-quality queries. |
| Ethics Committee | Update and view the IEC approval state for an assigned study. |
| Pharmacovigilance (PV) | View approved study metadata only; no safety case workflow exists in Phase 1. |

## Definitions used consistently

| Term | Meaning in SURTAMIND |
| --- | --- |
| Study | A clinical trial with code, title, PI, sites, sample target, protocol, and ethics information. |
| Protocol | Versioned, study-level clinical plan. It contains the Ayurveda intervention metadata. |
| Site | A trial location at which assigned coordinators enrol participants. |
| Participant | A pseudonymised study subject; dashboard/reporting identifies them by participant code only. |
| Baseline | Structured Ayurveda assessment made at enrollment for one participant in one study. |
| Visit | A planned or completed participant interaction, identified by visit number. |
| CRF | Case Report Form: the structured electronic record captured for exactly one visit. |
| Query | A monitor-raised clarification tied to a study record/field, answered by the coordinator and closed by the PI. |
| Master dictionary | Controlled vocabulary that drives dropdown fields; user-entered free text is avoided for standard concepts. |

## Product boundary

Phase 1 is a demoable **core CTMS**, not a full clinical-regulatory platform. It proves the clinical workflow and data model. Phase 2 and Phase 3 add operating resilience and interoperability after that workflow is stable.

## Key design principle

`Clinical record = internationally understandable data where a standard applies + Ayurveda-native structured observation where it does not.`

Example for an Amavata study using Yogaraja Guggulu:

| Clinical fact | Stored as |
| --- | --- |
| Vyadhi: Amavata | Ayurveda master code `V001` and display name. |
| Modern diagnosis: rheumatoid arthritis | Protocol/participant clinical diagnosis field. |
| Intervention: Yogaraja Guggulu | Ayurveda medicine master record; future WHODrug reference if available. |
| Nausea adverse event | Not captured in Phase 1; Phase 3 can map it to MedDRA. |
| Prakriti: Vata-Kapha | Ayurveda baseline code `P6`. |

## Decision framework: Phase 1 web stack

**Decision:** build a web MVP with React, FastAPI, and PostgreSQL.

**Why:** it is quick for the SIH demo, supports RBAC and reporting cleanly, and retains a scalable relational model for Phase 2/3.

**Alternatives:** a local desktop-first app, a no-code workflow, or a purely frontend mock.

**Why not those:** desktop-first/offline introduces sync complexity too early; no-code limits clinical workflow control; a frontend-only mock cannot credibly demonstrate security, data consistency, or real CRUD.

**Principle:** demonstrate one complete, trustworthy workflow before adding infrastructure-heavy features.
