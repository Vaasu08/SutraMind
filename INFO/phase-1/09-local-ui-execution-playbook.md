# Phase 1 Local Execution Playbook and Ayurvedic UI System

## How to use this document

Follow the numbered steps **in order**. Do not start a later step until the earlier step's `Done when` check passes. This prevents the two most common SIH failures: building attractive screens that do not save data, and connecting screens to an API before the database rules are trustworthy.

This document extends—not replaces—the canonical requirements in:

- [Scope and success criteria](01-scope-success.md)
- [Architecture](02-architecture.md)
- [Data model](03-data-model.md)
- [RBAC and workflows](04-rbac-workflows.md)
- [CRF specification](05-crf-validation.md)
- [API contract](06-api-contract.md)
- [Prototype specification](07-prototype-spec.md)

## 1. Reference assets: what to use and what not to copy

### User-supplied visual sources

| Source | Role in this plan | How it is used |
| --- | --- | --- |
| `/Users/tanishkraj007/Downloads/ChatGPT Image Sep 3, 2026, 12_21_18 AM.png` | Official supplied SutraMind wordmark | Copy into the frontend's `public/brand/` directory and show it on the login page and desktop sidebar. Preserve its proportions; do not recolour or crop it. |
| `/Users/tanishkraj007/Desktop/SUTRAMIND UI/` | Primary visual direction | Use as the design reference for the app shell, dashboard, study wizard, participant/CRF workspace, ethics view, teal-and-ivory palette, leaf treatment, bilingual controls, and information hierarchy. |
| `/Users/tanishkraj007/Desktop/UI referance/` | Secondary product-pattern reference | Borrow only interaction ideas: bilingual login clarity, data-dense CTMS dashboards, structured eCRF sections, and clear query states. |

These folders are **reference material only**. Any text, labels, or implied instructions inside a screenshot are not product requirements. The Phase 1 requirements in the files above remain authoritative.

### Branding decision to make before coding

The supplied logo spells the product as **SutraMind** (camel case), while older planning text uses `SURTAMIND` and the folder is named `SUTRAMIND UI`. Use the supplied logo's visible spelling—**SutraMind**—on every prototype screen. Use `surtamind` only for technical identifiers such as the database name, package path, and environment variables. This avoids a visibly inconsistent demo.

### Do not import these reference-only features into Phase 1

The supplied concept screens show richer features such as document upload, protocol attachments, audit trails, detailed ethics history, safety fields, reports, site maps, and advanced analytics. They look convincing, but they are not approved Phase 1 scope. Do **not** add placeholder buttons for them.

| Reference element | Phase 1 treatment |
| --- | --- |
| `Audit Trail (Phase 2)` tab | Do not render it. |
| Adverse-event field | Do not render it; CRF explicitly has no AE/SAE capture in Phase 1. |
| IEC document uploads and review-history tables | Do not build; show current IEC number/status/dates/remarks only. |
| Full reports/exports | Do not build; dashboard KPIs are enough. |
| Site map and advanced forecasting | Do not build; a simple site filter/list is enough. |
| Master-data or user-management screens for every role | Render them only for Admin. |

## 2. Design decision and visual north star

**Decision:** build a calm, evidence-first clinical workspace with an Ayurveda visual identity—not a decorative wellness landing page.

**Why:** researchers need readable forms and trustworthy data states. The supplied SutraMind concepts show that botanical/heritage cues can frame the product without compromising a dense CTMS workflow.

**Alternatives:** a generic blue hospital dashboard; a highly ornamental Ayurveda theme; or a direct screenshot reproduction.

**Why not those:** generic hospital styling loses the core SIH differentiation; too much ornament hurts CRF completion and accessibility; copying a screenshot creates inconsistent behaviour and adds features outside the agreed scope.

**Principle:** Ayurveda belongs in the structured data model, vocabulary, and restrained visual language. Clinical actions always remain clearer than decoration.

### Visual rules that must not be broken

1. The form field, its label, its unit, and its validation message always have higher contrast than any leaf, quote, or illustration behind them.
2. Use botanical images/watermarks only at the outer edge of a screen or in empty-state/insight panels. Never place them beneath form controls, table rows, or charts.
3. Teal means primary action or active navigation. It must not also mean error, warning, or disabled state.
4. Status is communicated by text and icon as well as colour: for example `Open`, `Answered`, `Closed`—not a coloured dot alone.
5. Sanskrit/Devanagari quotations are decorative. Do not use them as instructions or labels for clinical controls.
6. A UI component may be beautiful, but it is not implemented if it does not have a defined API, permission, validation rule, and empty/loading/error state.

## 3. Design tokens: copy this before building pages

Create `frontend/src/styles/tokens.css`. Do not scatter literal colour values through components.

```css
:root {
  /* Brand and clinical surfaces */
  --sm-brand-900: #064E47;
  --sm-brand-800: #06665B;
  --sm-brand-700: #087B6C;
  --sm-brand-600: #0A8B79;
  --sm-brand-100: #DDF3E9;
  --sm-brand-50: #F0FAF5;
  --sm-canvas: #F5F7F1;
  --sm-paper: #FFFEFA;
  --sm-paper-warm: #FBF7EC;
  --sm-line: #D9E4DA;
  --sm-text: #102A36;
  --sm-text-muted: #5C6D72;

  /* Semantic states: do not substitute these for brand colours */
  --sm-success: #247A52;
  --sm-success-bg: #E3F5E9;
  --sm-warning: #A85F00;
  --sm-warning-bg: #FFF0D5;
  --sm-danger: #B42318;
  --sm-danger-bg: #FEE8E7;
  --sm-info: #216A9C;
  --sm-info-bg: #E4F2FB;

  --sm-radius-sm: 8px;
  --sm-radius-md: 12px;
  --sm-radius-lg: 16px;
  --sm-shadow-card: 0 6px 20px rgb(6 78 71 / 8%);
  --sm-sidebar-width: 248px;
  --sm-header-height: 72px;
}
```

### Typography

| Use | Font stack | Rule |
| --- | --- | --- |
| Product UI | `Inter, system-ui, sans-serif` | Use for tables, forms, metrics, and navigation. |
| Hindi UI | `Noto Sans Devanagari, Inter, sans-serif` | Load before testing Hindi; never let Devanagari fall back to a tiny serif font. |
| Decorative quotation only | `Cormorant Garamond, Georgia, serif` | At most one quotation/insight panel per large page; never use for data. |
| Numeric metrics | `Inter, system-ui, sans-serif` with tabular figures | Enables clear BP, weight, dates, and KPI comparison. |

Use 14px minimum for form body text, 16px minimum for primary labels, 28–32px for page heading, and 20–24px for section heading. Maintain a 4px spacing scale: 4, 8, 12, 16, 24, 32, 40, 48.

### Component geometry

| Component | Required geometry |
| --- | --- |
| Top header | 72px high, white/ivory, bottom border `--sm-line`; contains search, language toggle, notification placeholder, avatar/menu. |
| Sidebar | 248px fixed at desktop; logo at top; 44px navigation rows; active item uses `--sm-brand-800` with white icon/text. |
| Page content | 24px desktop padding, 16px tablet, 12px phone; page max width is not artificially constrained inside app shell. |
| Card | `--sm-paper`, 1px line, 12–16px radius, 16–24px padding, subtle card shadow only. |
| Primary button | Brand-800 background, white 14px semibold text, 40px minimum height, visible keyboard focus outline. |
| Secondary button | Paper background, brand-800 border/text, same size as primary. |
| Input/select | 40px minimum height, explicit label above, unit inside/after field when needed, error directly below. |
| Status badge | Rounded 999px but with written status and icon; never rely on colour alone. |

### Responsive breakpoints

| Width | Required behaviour |
| --- | --- |
| `>= 1280px` | Fixed sidebar, full dashboard grid, optional 280px insight rail. |
| `1024–1279px` | Sidebar may collapse to icon rail; no mandatory insight rail; charts become two columns. |
| `768–1023px` | Sidebar becomes a drawer; dashboard/CRF cards use one or two columns as content permits. |
| `< 768px` | Header menu opens navigation drawer; tables become scrollable or change to labelled cards; CRF steps are one column; all primary actions remain visible. |

## 4. Exact local prerequisites

This plan assumes macOS with zsh, matching the current workspace. Run each command from `/Users/tanishkraj007/SIH`.

### 4.1 Verify tools

```zsh
node --version
npm --version
python3 --version
docker --version
docker compose version
```

Expected minimums: Node 20 LTS, npm 10+, Python 3.12+, Docker Desktop running. If Docker is unavailable, PostgreSQL 16+ must be installed locally and the connection URL adjusted. Do not continue until all selected runtime commands work.

### 4.2 Create the project layout

The `INFO/` directory already exists. The implementation lives beside it, never inside it.

```zsh
mkdir -p frontend backend database
npm create vite@latest frontend -- --template react-ts
python3 -m venv backend/.venv
```

Install frontend dependencies:

```zsh
cd frontend
npm install
npm install react-router-dom i18next react-i18next @tanstack/react-query react-hook-form zod @hookform/resolvers lucide-react recharts clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite eslint prettier
cd ..
```

Install backend dependencies:

```zsh
source backend/.venv/bin/activate
pip install fastapi "uvicorn[standard]" sqlalchemy alembic "psycopg[binary]" pydantic-settings pyjwt "pwdlib[argon2]" email-validator pytest httpx ruff
deactivate
```

**Do not** add a UI kit, an AI SDK, FHIR/CDISC package, SQLite sync library, or document-storage service in Phase 1. They add dependency cost without improving the core judge workflow.

### 4.3 Create the local PostgreSQL service

Create `compose.yml` at repository root:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sutramind
      POSTGRES_USER: sutramind
      POSTGRES_PASSWORD: sutramind_local_only
    ports:
      - "5432:5432"
    volumes:
      - sutramind_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sutramind -d sutramind"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  sutramind_pgdata:
```

Start and verify it:

```zsh
docker compose up -d db
docker compose ps
docker compose exec db pg_isready -U sutramind -d sutramind
```

`pg_isready` must say `accepting connections`. The supplied password is for local, disposable development only. It must be replaced in a deployed environment and never committed as a production credential.

### 4.4 Add environment files before code

Create `backend/.env` locally (do not commit it):

```dotenv
DATABASE_URL=postgresql+psycopg://sutramind:sutramind_local_only@localhost:5432/sutramind
JWT_SECRET=replace_with_a_local_random_64_character_secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173
```

Create `frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Create a root `.gitignore` containing at least:

```gitignore
backend/.venv/
backend/.env
frontend/.env.local
frontend/node_modules/
frontend/dist/
__pycache__/
.pytest_cache/
```

## 5. Build the backend foundation first

### Step 5.1 — Create predictable backend folders

Create the following exact structure before adding feature code:

```text
backend/
  app/
    main.py
    config.py
    db/{base.py,session.py}
    auth/{dependencies.py,jwt.py,passwords.py}
    models/
    schemas/
    services/
    routers/
    seed/
    tests/
  alembic.ini
  migrations/
```

Responsibilities must stay separate:

| Folder | Put here | Never put here |
| --- | --- | --- |
| `models/` | SQLAlchemy tables and relationships | HTTP response parsing or permission decision logic. |
| `schemas/` | Pydantic request/response types | database session calls. |
| `routers/` | path, method, dependency, response status | long business logic or raw SQL. |
| `services/` | enrollment transaction, state transitions, access-scoped changes | JSX or FastAPI route decoration. |
| `auth/` | passwords, token generation/validation, current-user dependency | clinical business rules. |
| `seed/` | idempotent synthetic demo data | production passwords or real patient data. |

### Step 5.2 — Establish the health endpoint

Implement `GET /health` returning `{ "status": "ok" }`. Start it locally:

```zsh
source backend/.venv/bin/activate
cd backend
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` and confirm FastAPI Swagger loads. Stop only with `Ctrl+C` after verification.

**Done when:** `/health` returns HTTP 200 and the server restarts after an edited Python file.

### Step 5.3 — Implement migrations and core data model

Implement models in this dependency order:

1. `users`, `studies`, `study_memberships`, `sites`
2. `master_terms`, `medicines`
3. `protocols`, `ethics_reviews`, `milestones`
4. `participants`, `ayurveda_baselines`
5. `visits`, `crfs`, `queries`

Use the exact fields, relationships, uniqueness rules, lifecycle values, and reports defined in [03-data-model.md](03-data-model.md). Do not make `prakriti`, `agni`, or `dosage_form` frontend-only enums; store master term codes.

After each coherent group, create and apply a migration:

```zsh
cd backend
source .venv/bin/activate
alembic revision --autogenerate -m "create core study tables"
alembic upgrade head
alembic current
```

Inspect the schema using pgAdmin or:

```zsh
docker compose exec db psql -U sutramind -d sutramind -c '\dt'
```

**Done when:** a blank database upgrades to the latest revision without manual SQL and all expected tables exist.

### Step 5.4 — Add seed data before UI screens

The seed command must be idempotent: running it a second time must not duplicate records. Seed in this order:

1. Master terms from `INFO/reference-data/ayurveda-master-dictionary.json`.
2. Medicine `MED001`, Yogaraja Guggulu, dosage form `DF01`.
3. Six active users: Admin, PI, Coordinator, Monitor, Ethics, and PV.
4. Study `AMAVATA-001`, its PI membership/site, active protocol, and IEC record.
5. Synthetic participant `AMV-001` and Vata-Kapha/Vishama Agni baseline.
6. A scheduled visit, then a completed visit/CRF with compliant treatment.
7. One open Monitor query (and optional answered/closed example).

Define the seed command as a Python module, for example `python -m app.seed.run`. Print only created/updated counts—not passwords or clinical payloads.

**Done when:** reset/migrate/seed produces a dashboard-ready database in under one minute.

## 6. Implement security and RBAC before feature UI

### Step 6.1 — Authentication

Implement in this order:

1. `hash_password()` with Argon2 through `pwdlib`.
2. `verify_password()`.
3. `create_access_token(user_id, role, expiry)`.
4. `get_current_user()` that validates signature, expiry, active user, and user ID from database.
5. `POST /api/v1/auth/login` and `GET /api/v1/auth/me`.

Login returns only the access token and a safe user summary: `id`, `name`, `email`, `role`, and allowed study/site assignments. It never returns `password_hash`.

### Step 6.2 — Permission boundary

Write explicit permission constants such as:

```text
study:create          participant:create      baseline:update
protocol:update       visit:schedule          crf:write
participant:read      query:raise             query:answer
query:close           ethics:update           master_term:manage
```

Implement one central `require_permission()` dependency and one `assert_study_access()` service check. The exact role matrix is in [04-rbac-workflows.md](04-rbac-workflows.md).

For every route that receives `study_id`, `participant_id`, `visit_id`, `crf_id`, or `query_id`:

1. Resolve the record.
2. Derive its parent study in backend code.
3. Check the caller's role and membership/site assignment.
4. Only then read or modify it.

Never accept a client-supplied `role`, `created_by`, or parent-study field as authorization evidence.

### Step 6.3 — Tests that must pass now

| Test | Expected result |
| --- | --- |
| Incorrect password | `401`; same generic message as unknown account. |
| Inactive user | `401` or `403` per API convention; no token. |
| Coordinator creates study | `403`. |
| Ethics user reads participant profile | `404`/`403`, never participant content. |
| Monitor edits CRF | `403`. |
| PI closes unanswered query | `409`. |
| Coordinator creates participant at unassigned site | `403`. |

**Done when:** these tests run through FastAPI's test client and pass before a single feature page is considered complete.

## 7. Create the frontend foundation and use the logo correctly

### Step 7.1 — Copy only the approved brand asset

When implementation begins, run:

```zsh
mkdir -p frontend/public/brand
cp "/Users/tanishkraj007/Downloads/ChatGPT Image Sep 3, 2026, 12_21_18 AM.png" frontend/public/brand/sutramind-logo.png
```

In React, reference it with `src="/brand/sutramind-logo.png"`. Do not base64-embed it and do not point the deployed app to a local Desktop/Downloads path.

Use the full logo on the login page. In the narrow sidebar, use a text/leaf-mark variant only after a deliberately created, approved asset exists; otherwise retain the full logo at a legible size. Do not squish the original 3:1 wordmark into a square icon.

### Step 7.2 — Establish frontend folders

```text
frontend/src/
  api/{client.ts,auth.ts,studies.ts,participants.ts,visits.ts,queries.ts,masterTerms.ts}
  app/{router.tsx,providers.tsx}
  components/{ui,layout,charts,forms}
  features/{auth,dashboard,studies,participants,visits,queries,admin,ethics}
  hooks/
  locales/{en.json,hi.json}
  styles/{tokens.css,globals.css}
  types/
```

Install Tailwind only after `tokens.css` exists, then map Tailwind semantic names to the CSS variables. Do not use raw `green-500`, `red-500`, or arbitrary values across pages. The project needs one visual language, not a component library collage.

### Step 7.3 — Configure app providers

Wrap the app, in this order, with:

1. i18next provider
2. React Query provider
3. Authentication/session provider
4. React Router provider

The API client must:

- read `VITE_API_BASE_URL`;
- attach the Bearer token;
- on `401`, clear local session and navigate to login;
- normalize API errors into a typed shape usable by forms;
- never hold a PostgreSQL connection or RBAC logic.

### Step 7.4 — Implement language handling before content screens

Create `en.json` and `hi.json` with identical keys. Start with:

```text
nav.dashboard, nav.studies, nav.participants, nav.visits_crf, nav.queries,
nav.ethics, nav.master_data, auth.email, auth.password, auth.sign_in,
common.save, common.cancel, common.next, common.previous, common.required,
status.open, status.answered, status.closed, status.approved,
ayurveda.prakriti, ayurveda.vikriti, ayurveda.agni, ayurveda.bala,
ayurveda.satva, ayurveda.vyadhi, ayurveda.anupana
```

For example, `ayurveda.agni` maps to `Agni` in English and `अग्नि` in Hindi. Dictionary labels come from the API's `label_en`/`label_hi`; do not hand-translate the same master term inside each form.

Persist a user's language preference in `localStorage` for the prototype. This is a preference only; it is not clinical data and should not be placed in a participant record.

**Done when:** switching English/Hindi on login and after login updates navigation, buttons, error messages, statuses, and master-term display labels without changing saved codes or refreshing away unsaved text.

## 8. Build the reusable app shell before any feature page

### Desktop composition

```text
+---------------- Sidebar 248px ----------------+---------------- Main ----------------+
| Full SutraMind logo                            | Header: search | language | profile    |
| Dashboard                                      +----------------------------------------+
| Studies                                        | Breadcrumb (when relevant)               |
| Participants                                   | Page title + one-line clinical purpose   |
| Visits & CRF                                   |                                        |
| Queries                                        | Feature content                          |
| Ethics (role dependent)                        |                                        |
| Master Data / Administration (Admin only)      |                                        |
+------------------------------------------------+----------------------------------------+
```

### Required shell components

| Component | Exact responsibility |
| --- | --- |
| `AppShell` | Applies canvas background, sidebar/header placement, and responsive drawer behaviour. |
| `Sidebar` | Renders only navigation routes allowed for current role. It does not authorize API calls. |
| `TopHeader` | Global search placeholder may be present but need not function in Phase 1; language toggle and profile/logout must work. |
| `PageHeader` | Breadcrumb, title, description, primary action slot, optional study selector. |
| `ClinicalCard` | One consistent surface for form sections, KPI cards, table containers, and insight panels. |
| `StatusBadge` | Maps status enum to semantic style and translated text. |
| `EmptyState`, `LoadingState`, `ErrorState` | Required for every data-driven route. |

### Ayurvedic visual treatment

- Add one very low-opacity (`<= 8%`) leaf watermark in a page corner using an original vector/CSS motif or approved asset.
- Use warm ivory `--sm-paper-warm` only for an optional side insight/quote card; main data remains on white/ivory cards.
- Use a mortar-and-pestle/leaf visual only on the login panel, dashboard side insight, or empty state. Never make it the primary control icon.
- Use an Ayurveda-relevant quote only in a non-essential panel; provide no action instruction inside it.
- Render the Ministry/AYUSH emblem only if the team has approval to use it. Do not imply government affiliation simply because the product targets government-ready research.

**Done when:** all protected routes share the same responsive shell; navigation is role-aware; the logo is sharp and undistorted; the screen still reads clearly after temporarily disabling decorative images.

## 9. Implement Phase 1 screens in this exact order

### Step 9.1 — Login

Implement the login screen first because every other page needs a real session.

**Layout:** split desktop panel. Left: logo, restrained leaf/mortar illustration, a short bilingual clinical-research message. Right: login card with language toggle, email, password, password visibility toggle, error area, and `Sign in` button. On mobile, stack left artwork above the card or hide it; never hide the logo/form.

**API:** `POST /auth/login`, then `GET /auth/me` or login response session summary.

**Rules:** submit on Enter; disable submit while request is pending; announce error to screen readers; redirect by allowed default route; do not implement password reset in Phase 1.

**Done when:** every seeded role can sign in, switch language, refresh once while session is valid, and sign out.

### Step 9.2 — Dashboard

Build this after seed data exists, not before. All numbers must be API-derived.

**Top controls:** accessible study filter; date filter only if the backend supports it. PI/Admin choose accessible study; Coordinator/Monitor only see assigned study choices.

**Required cards:** Active Studies, Recruitment, Completed Visits, Open Queries, Ethics Status. The source UI's additional Sites/Insights cards are optional only if the API provides correct data.

**Required visualizations:**

| Visual | Data source | User action |
| --- | --- | --- |
| Recruitment progress bar | enrolled count / sample size | Link to filtered participant list. |
| Prakriti donut | grouped baseline `prakriti_code` | Legend shows translated code/name + count/percent. |
| Vyadhi horizontal bars | grouped participant `vyadhi_code` | Link to participant list. |
| Visit completion | completed / tracked visits | Link to Visits & CRF filtered by status. |
| Treatment compliance donut | completed CRFs' compliance | Link to completed CRF list. |
| Ethics badge | current `ethics_reviews.status` | Link only for roles allowed to view ethics. |

**No misleading charts:** omit a chart when it has no data and show a small empty state. Do not draw a fabricated 78% or forecast. Use no more than six chart/cards above the fold.

**Done when:** create/complete records in the normal workflow, refresh dashboard, and see exactly the relevant KPI change.

### Step 9.3 — Studies and the study-creation wizard

**Study list:** filters for status; table fields: Study Code, Title, Ayurveda Vyadhi, Status, Start Date, Participants/Target, Actions. Do not display more columns than fit.

**Create Study wizard:** six steps. A step only advances after validation.

| Step | Fields | Backend state |
| --- | --- | --- |
| 1. Basic information | title, short title, study code, type, phase, sample size, dates, PI, institution | Local form state only. |
| 2. Protocol details | version, protocol summary/background/objectives (short text only in Phase 1) | Local form state only. |
| 3. Ayurveda specifics | Vyadhi, modern diagnosis, intervention/medicine, dosage form, Anupana, treatment duration, assessment parameters | Master-term/medicine codes in local form state. |
| 4. Ethics & regulatory | IEC number, ethics status, CTRI number optional, dates, remarks | Local form state only. |
| 5. Sites & team | at least one study site and Coordinator assignment | Local form state only. |
| 6. Review & submit | read-only summary; agreement that synthetic/demo data is correct | `POST /studies` once. |

The initial Phase 1 data model did not require attachments or rich text. Do not add files, document upload, or styled rich text to this wizard. A plain textarea with maximum length and preview is sufficient.

**Critical validation:** study code 3–30 uppercase slug; positive sample size; end date no earlier than start date; dictionary values active; IEC may be pending; CTRI optional; protocol must have all Ayurveda intervention fields before submission.

**Done when:** PI creates a study, sees it in list/detail/dashboard, and a Coordinator cannot access the creation route or API.

### Step 9.4 — Participant registry and enrollment

**Registry:** table with participant code, age, gender, study code, modern diagnosis, Ayurveda Vyadhi, Prakriti, enrollment date, current visit, status, action menu. The detail list can show name only to permitted study staff; it is never used in dashboard/report cards.

**Enrollment:** a four-section form with a progress indicator—not a giant unstructured page.

| Section | Required fields | UX detail |
| --- | --- | --- |
| Demographics | participant code, name, age, gender | Explain that code is the reporting identity. |
| Clinical | modern diagnosis, Vyadhi, disease duration | Vyadhi is a dictionary selection; modern diagnosis can default from mapping but stays reviewable. |
| Ayurveda baseline | Prakriti, Agni, Bala, Satva, Vikriti notes | Use code-backed dropdowns and retain Sanskrit/Devanagari label where useful. |
| Trial assignment | randomization ID, enrollment date, site | Site menu is constrained to Coordinator's assigned sites. |

Submit this as one API transaction. Do not create a participant record first and baseline later; a partially enrolled subject is clinically misleading.

**Done when:** coordinator can enroll synthetic `AMV-002`; database creates participant + exactly one baseline; dashboard recruitment and Prakriti/Vyadhi counts update.

### Step 9.5 — Participant profile and visit timeline

Build this page before CRF editing because it establishes the context of each visit.

**Header card:** participant code, enrolled/status badge, age/gender, study/site, edit control only where permitted. Do not expose phone/address/contact unless that data is truly in scope; Phase 1 requirements only need name, age, and gender.

**Tabs:** Overview, Ayurveda Baseline, Visits, Queries. Do not show Documents, Audit Trail, or AE tabs.

**Overview cards:** Demographics; Clinical; Ayurveda Baseline; Current Treatment. Baseline values are visibly labelled **Baseline** and cannot be mistaken for a current visit observation.

**Timeline:** Screening/Baseline/Visit 1/Visit 2 labels adapt to actual scheduled visit numbers. Completed has a check icon; upcoming is neutral; missed includes written `Missed` label. `Schedule visit` appears only to assigned Coordinator.

**Done when:** opening a participant from registry always leads to the correct study context and visit timeline, even after refresh.

### Step 9.6 — Visit and CRF workspace

This is the highest-priority implementation screen. Build it exactly to [05-crf-validation.md](05-crf-validation.md).

**Layout:**

- Header: participant code, study, visit number/date, current visit status, progress indicator.
- Left: five step navigator—Visit Information, Vitals & General, Ayurveda Assessment, Treatment & Compliance, Investigator Notes.
- Centre: one section at a time on desktop and phone. Keep all entered draft state while changing steps.
- Right (desktop only): compact data-query panel and CRF completion panel. On tablet/mobile it moves below form.
- Footer: Previous / Save Draft / Next or Complete CRF. `Complete CRF` appears on final step after validation.

**CRF fields:**

| Section | Inputs | Validation |
| --- | --- | --- |
| Visit information | visit number display, date, site display, investigator | date >= enrollment date; investigator required. |
| Vitals | systolic/diastolic BP, pulse, weight, temperature | prescribed ranges; diastolic lower than systolic. |
| Ayurveda | Agni, Bala, current symptoms, other observation/notes | Agni/Bala required and master-code backed. |
| Treatment | formulation, dose, frequency, Anupana display/selection where protocol permits, compliance | formulation/dose/frequency/compliance required. |
| Notes | PI/coordinator remarks | optional but max length enforced. |

`Save Draft` must save incomplete permitted data and display a `Draft saved` confirmation. `Complete CRF` performs full client/server validation, creates/updates the CRF, and atomically sets Visit to `COMPLETED`.

Do not include the reference UI's `Any Adverse Events` field. Show nothing in its place; safety is Phase 2.

**Done when:** a Coordinator saves a draft, reloads, resumes it, completes all mandatory fields, then sees the visit become completed and dashboard completion/adherence update.

### Step 9.7 — Query workflow

Build real linking from a participant/CRF field. A generic free-floating task list is not sufficient.

**Monitor path:** on a visible CRF/profile field select `Raise query`; dialog pre-populates target type, target record, field name, study ID; Monitor enters message and creates `OPEN` query.

**Coordinator path:** sees Open queries scoped to their study/site; opens one; provides non-empty answer; status becomes `ANSWERED`.

**PI path:** sees Answered queries; reviews context and answer; presses `Close query`; status becomes `CLOSED`.

**Required list columns:** Query ID, participant code, target/field, short message, status, raised by/date, action. Do not display participant name by default.

**Done when:** the same query is visible with its correct state to Monitor, Coordinator, and PI and the API rejects an illegal state transition.

### Step 9.8 — Ethics and Administration

Keep these small and permission-limited.

**Ethics panel:** current IEC number, approval/expiry date, status, remarks. Only Ethics role has editable controls. Status progression uses documented allowed values. It must not show participants/CRFs.

**Admin panel:** manage user active status, study/site membership, and master terms. Master-term deletion is prohibited: offer deactivation. Do not add general role editing on any user page—role change is an explicit Admin-only form with confirmation.

**Done when:** Admin can deactivate a dictionary term without breaking existing records; Ethics can update a current decision but cannot read participant data.

## 10. Feature integration order

Do not mark a feature complete because its React screen exists. Use this order for every module:

```text
Database model
  -> Alembic migration
  -> Pydantic schema
  -> service/business rule
  -> protected API route
  -> API test
  -> typed frontend API function
  -> page/form UI
  -> loading/error/empty states
  -> manual cross-role test
  -> dashboard impact check
```

If any arrow is missing, the work is incomplete. For example, a CRF field is not added merely by adding an input: it must be included in its schema, migration, validation, API test, translated label, and dashboard calculation if relevant.

## 11. Local runbook: how to start the application every day

Open three terminal windows from the project root.

### Terminal 1: database

```zsh
docker compose up -d db
docker compose ps
```

### Terminal 2: API

```zsh
source backend/.venv/bin/activate
cd backend
alembic upgrade head
python -m app.seed.run
uvicorn app.main:app --reload --port 8000
```

### Terminal 3: frontend

```zsh
cd frontend
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. Before testing UI, open `http://localhost:8000/docs` and confirm the API responds.

### Reset a disposable local database

Only reset the local Docker volume when all data can safely be discarded:

```zsh
docker compose down -v
docker compose up -d db
```

Then rerun Terminal 2 migration and seed commands. Never run this command against a shared, deployed, or real-data environment.

## 12. Daily verification checklist

At the end of every coding day, run:

```zsh
cd frontend && npm run build && npm run lint
cd ../backend && source .venv/bin/activate && pytest && ruff check app tests
```

Then perform these manual checks for every changed screen:

- Test at 1440px and 390px width.
- Switch English/Hindi once.
- Refresh after save.
- Test loading, empty, validation-error, and API-error state.
- Test with the role allowed to act and one role that must be denied.
- Confirm a decorative image/watermark has not reduced field, chart, or table readability.

## 13. Final Phase 1 rehearsal: exact five-minute script

1. Sign in as PI. Show dashboard: recruitment, visit completion, Prakriti distribution, Vyadhi distribution, adherence, and ethics status.
2. Open `AMAVATA-001`. Show that Ayurveda data is controlled: Vyadhi, formulation, dosage form, Anupana, and duration—not informal notes.
3. Sign in as Coordinator. Enrol synthetic participant `AMV-002`; record Prakriti, Agni, Bala, Satva, Vikriti; submit.
4. Schedule/complete Visit 1. Show real vitals, Agni/Bala/symptoms, formulation, dose, and compliance in the CRF.
5. Sign in as Monitor. Raise a query on a specific CRF field. Return as Coordinator to answer it; return as PI to close it.
6. Switch to Hindi. Show navigation, form labels, and Ayurveda display values change while the stored participant code remains `AMV-002`.
7. Return to dashboard. Show the changed recruitment, visit, adherence, and query values.

## 14. Final non-negotiable release gates

- [ ] Fresh `docker compose up`, migration, and seed succeed from an empty local database.
- [ ] All 9 Phase 1 success actions in [01-scope-success.md](01-scope-success.md) work end to end.
- [ ] Every write route has a server-side permission and study/site-scoping test.
- [ ] One participant has one baseline; one visit has one CRF; duplicates fail safely.
- [ ] Dashboard values are database aggregates, never fixed mock numerals.
- [ ] Both language JSON files have the same keys; no raw translation key renders.
- [ ] Logo is shown correctly and all other visual assets are original/approved or CSS-created.
- [ ] No Phase 2/3 module is represented as working in the UI.
- [ ] No real patient data, passwords, or production secrets are in the repository or screenshots.

When every checkbox is complete, Phase 1 is ready for a credible SIH demonstration.
