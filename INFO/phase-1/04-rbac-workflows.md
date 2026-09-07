# RBAC and Clinical Workflows

## Permission matrix

`C/E` means create or edit; `V` means read-only; `—` means denied. All permissions are still limited to assigned studies/sites except Admin's global access.

| Capability | Admin | PI | Coordinator | Monitor | Ethics | PV |
| --- | --- | --- | --- | --- | --- |
| Log in | C/E | C/E | C/E | C/E | C/E | C/E |
| Create/manage users and assignments | C/E | — | — | — | — | — |
| Manage master dictionary | C/E | V | — | V | — | — |
| Create study | C/E | C/E | — | — | — | — |
| Edit own study/protocol | V | C/E | — | V | V | V |
| View participants/visits | V | V | C/E for assigned site | V | — | — |
| Enrol / submit participant | — | V/approve | C/E | — | — | — |
| Record baseline / CRF | — | V | C/E | V | — | — |
| Schedule/update visit | V | V | C/E | V | — | — |
| Raise query | — | V | — | C/E | — | — |
| Answer query | — | C/E | C/E | V | — | — |
| Close query | — | C/E | — | — | — | — |
| Update current ethics decision | — | V | — | — | C/E | V |
| View recruitment dashboard | C/E | C/E | V | V | — | V (metadata only) |

The prior source matrices varied slightly. This is the canonical operational division: **Coordinator enters data; Monitor queries it; PI governs it; Ethics owns ethics state; Admin owns access and controlled vocabulary.**

## Backend permission mechanics

1. Login identifies a `users` record and embeds only identity/role/token expiry in the JWT.
2. Each request resolves the current active user from the token.
3. A route declares an action, for example `participant:create` or `query:close`.
4. The authorization service checks role **and** `study_memberships`/site assignment.
5. The service layer performs the change only after record-to-study ownership is validated.
6. Denials return `403 FORBIDDEN`; missing/inaccessible records return `404` to avoid data leakage.

Never rely on a hidden React button as a permission control.

## Lifecycle states

```text
Study:       DRAFT -> ACTIVE -> CLOSED
Participant: DRAFT -> SUBMITTED -> ENROLLED -> COMPLETED
                                      \-> WITHDRAWN
Visit:       SCHEDULED -> COMPLETED | MISSED
CRF:         DRAFT -> COMPLETED
Query:       OPEN -> ANSWERED -> CLOSED
Ethics:      PENDING -> SUBMITTED -> APPROVED | REJECTED | EXPIRED
```

Allowed state changes are checked by service methods, not passed through as arbitrary `status` strings.

## PI workflow

1. PI creates study in `DRAFT`, sets title/code/institution/dates/sample target.
2. PI creates protocol version 1, selecting Vyadhi, diagnosis, formulation, dosage form, Anupana, and duration.
3. Admin adds sites and assigned staff; Ethics records IEC state.
4. PI activates the study only after an approved ethics state is visible in the prototype.
5. PI reviews submitted participants, dashboard KPIs, and answered queries.
6. PI closes resolved queries and closes study after recruitment/follow-up is complete.

## Coordinator workflow

1. Select an assigned active study/site.
2. Create participant as `DRAFT`; fill demographics, diagnosis, Vyadhi, disease duration, and randomisation ID.
3. Record the structured Ayurveda baseline and submit the participant.
4. PI approves enrollment (or the demo presents this as immediate PI review).
5. Schedule Visit 1 and later visits.
6. Save CRF as draft while information is incomplete; complete it once mandatory observations are entered.
7. Read and answer Monitor queries with a clarification; cannot close them.

## Monitor workflow

1. Filter active study participants and completed CRFs.
2. Open a CRF and inspect its records.
3. Raise a query linked to a target record and, when applicable, a field (for example `weight_kg`).
4. Read Coordinator answer; the Monitor may add a new query if it remains insufficient but does not close the original query in the MVP.

## Ethics workflow

1. Open assigned study metadata.
2. Update only IEC number, status, dates, and ethics remarks.
3. Cannot read participant data or amend protocol content.

## Query workflow requirements

| Step | Actor | Required data | Result |
| --- | --- | --- | --- |
| Raise | Monitor | Study, record type/ID, optional field, question | `OPEN` query. |
| Answer | Coordinator or PI | Non-empty response | `ANSWERED`; answer author/date saved. |
| Close | PI | Query already `ANSWERED` | `CLOSED`; no further changes. |

Phase 1 has no automated query generation, no electronic signature, and no audit trail. The workflow is manual by design.
