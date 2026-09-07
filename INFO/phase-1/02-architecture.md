# Phase 1 Architecture and Technology

## Chosen stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Web frontend | React 19, Vite, TypeScript, Tailwind CSS | Responsive forms, dashboards, routing, role-aware UI. |
| Frontend navigation | React Router | Protected routes and study/participant/visit navigation. |
| Internationalisation | i18next with `en.json` and `hi.json` | Instant language selection and translated labels. |
| API | FastAPI + Pydantic | Typed REST contracts, request validation, generated OpenAPI documentation. |
| Data access | SQLAlchemy | Explicit relational models and transactions. |
| Authentication | JWT + secure password hash | Logged-in identity and API authorization. |
| Database | PostgreSQL | Clinical workflow data, constraints, reporting queries. |
| Schema management | Alembic | Versioned, repeatable migrations. |
| Database administration | pgAdmin | Local development inspection only; never the app's public interface. |

## Component model

```text
Browser (React + i18next)
        |
        | HTTPS / JSON + Bearer token
        v
FastAPI routers -> auth/RBAC dependency -> service layer -> SQLAlchemy repositories
                                                               |
                                                               v
                                                        PostgreSQL + Alembic
```

The browser does not talk to PostgreSQL. It may hide unavailable controls for usability, but FastAPI is the authority that allows or rejects every operation.

## Backend module layout

```text
surtamind/
  frontend/
    src/{pages,components,layouts,features,locales,api,types}
  backend/
    app/
      main.py
      db/{session.py,base.py}
      models/
      schemas/
      routers/
      services/
      auth/{jwt.py,passwords.py,dependencies.py}
      seed/
      tests/
  database/
    migrations/
  docs/
  INFO/
```

## Frontend implementation rules

- Type every API response and form payload; do not keep clinical fields as untyped `any` objects.
- Organise by feature (`studies`, `participants`, `visits`, `queries`) rather than one large components directory.
- Keep saved dictionary codes in form state. Translate only the rendered label.
- Use one shared form-field component for required indicators, error text, select lists, and Hindi/English labels.
- Route guards improve UX; they do not replace server checks.

## Backend implementation rules

- Use a `get_current_user` dependency and a reusable `require_permission(action, resource)` dependency on all protected routes.
- Validate ownership/scoping: a Coordinator can act only for a study/site assigned to them, not merely because their role is Coordinator.
- Wrap participant enrollment + baseline creation in one database transaction.
- Return structured 4xx errors suitable for field-level UI messages; do not expose raw database errors.
- Use UUID primary keys internally and human-readable codes for users.
- Add pagination and study filters for list endpoints from day one, even if demo data is small.

## Minimum security baseline

| Concern | Phase 1 implementation |
| --- | --- |
| Passwords | Argon2id or bcrypt hashes only; never seed/return plain passwords outside local demo instructions. |
| Authentication | Short-lived JWT access token; validate signature, expiry, active user, and role. |
| Access | RBAC plus study/site assignment checks in API dependencies/services. |
| Validation | Pydantic request validation and database foreign-key/unique/check constraints. |
| Sensitive data | Participant names excluded from KPIs and mock/demo projection. |
| Logging | Log application errors without credentials or clinical payloads. |
| CORS | Allow only the configured frontend development/production origin. |
| Secrets | `.env` variables, not source control. |

Phase 1 intentionally lacks a regulatory immutable audit trail. The absence must be stated in the demo rather than implied away.

## Local development dependencies

- Node.js LTS and npm/pnpm
- Python 3.12+ and virtual environment
- PostgreSQL 16+ and pgAdmin
- Docker Compose is optional but recommended for repeatable local PostgreSQL setup

## Deployment shape for the demo

Use one managed PostgreSQL instance, one FastAPI service, and one static frontend deployment. Seed a non-production demo database. Never expose pgAdmin publicly or use a real patient dataset.
