# SutraMind v1 — Smart CTMS for Ayurveda

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org)
[![Tailwind CSS / Design System](https://img.shields.io/badge/Design-Ayurvedic%20Teal%20%26%20Ivory-0F766E.svg)](INFO/phase-1/09-local-ui-execution-playbook.md)

**SutraMind** is an Ayurveda-native Clinical Trial Management System (CTMS) designed for the Smart India Hackathon (SIH) Phase 1 prototype. It helps Ayurveda clinical-research teams manage controlled trials from study setup through participant visits and data-query resolution, while preserving Ayurveda observations (*Prakriti*, *Vikriti*, *Agni*, *Bala*, *Satva*, *Anupana*) as first-class structured data ready for modern clinical compliance and international interoperability.

---

## 🌟 Key Capabilities

1. **Role-Based Access Control (RBAC)**:
   - Strictly enforced at the FastAPI backend level across 6 distinct roles:
     - **Admin**: Master terminology & user management.
     - **Principal Investigator (PI)**: Protocol creation, study oversight, query closure.
     - **Study Coordinator**: Participant enrollment, baseline entry, visit scheduling, eCRF completion, query responses.
     - **Monitor (CRA)**: Remote monitoring, site verification, raising data queries on CRF fields.
     - **Ethics Committee (IEC)**: Study review status, approval dates, meeting remarks (without unauthorized access to direct participant identifiers).
     - **Pharmacovigilance (PV)**: Adverse event tracking and safety signals.
2. **Ayurveda-Native Baseline & Digital CRF**:
   - Structured assessment of *Prakriti* (Dosha constitution), *Vikriti*, *Agni* (digestive fire), *Bala* (strength/immunity), and *Satva* (mental stamina).
   - Standardized capture of formulations, dosage forms (*Vati*, *Kwatha*, *Churna*, *Taila*), *Anupana* (adjuvant), and traditional pathya/apathya instructions.
3. **Data Query Workflow**:
   - Monitors raise queries on specific CRF fields with severity levels.
   - Coordinators review and respond with audit comments.
   - PIs review resolutions and close or re-query.
4. **Real-time Research KPIs & Analytics**:
   - Recruitment progress vs. target, visit completion rates, medication adherence %, *Prakriti* and *Vyadhi* distribution charts.
5. **Bilingual Support (English & Hindi)**:
   - Instant localization toggle supporting Devanagari terminology and bilingual labels across all forms, tables, and statuses.

---

## 📁 Repository Structure

```
.
├── INFO/                             # Canonical architecture, planning, and specifications
│   ├── README.md                     # Information base overview & key decisions
│   ├── 01-product-domain.md          # Clinical boundary, user journeys & terminology
│   ├── 02-standards-ayurveda.md      # Standards mapping (MedDRA, WHODrug, NAMASTE)
│   ├── IMPLEMENTATION_LOG.md         # Live execution history & verification record
│   ├── roadmap-phase-2-3.md          # Roadmap for Phase 2 (Panchakarma, AE/SAE, offline sync)
│   ├── reference-data/               # Master dictionary seeds (Prakriti, Vyadhi, etc.)
│   └── phase-1/                      # Phase 1 specifications (01 to 09)
│       ├── 01-scope-success.md       # Scope boundaries & acceptance criteria
│       ├── 02-architecture.md        # System architecture & security boundaries
│       ├── 03-data-model.md          # 13 transactional tables + master dictionaries
│       ├── 04-rbac-workflows.md      # Permissions matrix & state transitions
│       ├── 05-crf-validation.md      # Electronic CRF validation rules
│       ├── 06-api-contract.md        # REST API endpoints & schemas
│       ├── 07-prototype-spec.md      # Screen-by-screen prototype spec & demo script
│       ├── 08-execution-plan.md      # Sprint plan & release checklist
│       └── 09-local-ui-execution-playbook.md # UI design tokens & visual system
├── backend/                          # FastAPI REST API & database layer
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry point & CORS configuration
│   │   ├── config.py                 # Pydantic settings (DB, JWT, CORS)
│   │   ├── database.py               # SQLAlchemy database session & engine
│   │   ├── models.py                 # Relational models (Users, Studies, CRFs, Queries, etc.)
│   │   ├── schemas.py                # Pydantic request/response validation schemas
│   │   ├── auth.py                   # JWT generation, verification & password hashing
│   │   ├── rbac.py                   # Dependency-injected role & permission guards
│   │   ├── routers/                  # API routers (auth, studies, participants, crfs, queries, etc.)
│   │   └── seed.py                   # Seed script initializing master terms & demo users
│   ├── tests/
│   │   └── test_phase1.py            # Automated integration test suite (12 test suites)
│   ├── requirements.txt              # Python package dependencies
│   └── .env.example                  # Environment configuration template
├── frontend/                         # React 19 + TypeScript + Vite web application
│   ├── src/
│   │   ├── App.tsx                   # Main root view with routing & role switching
│   │   ├── styles.css                # Custom Ayurvedic Teal & Ivory botanical design tokens
│   │   ├── components/               # UI components (Navbar, Sidebar, Modals, Tables, Forms)
│   │   ├── views/                    # Views (Dashboard, Studies, Participants, CRFs, Queries, Admin)
│   │   ├── context/                  # AuthContext, LanguageContext (EN/HI)
│   │   ├── api/                      # Axios/fetch client bindings to FastAPI
│   │   └── types/                    # TypeScript interfaces for models & responses
│   ├── package.json                  # Dependencies & npm scripts
│   └── .env.example                  # Frontend environment configuration
├── compose.yml                       # Docker Compose definition for optional PostgreSQL database
├── SUTRAMIND UI/                     # UI visual references and brand assets
└── UI referance/                     # Prototype reference screenshots
```

---

## 🚀 Getting Started & Local Instructions

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: 18 or higher (with `npm`)
- *(Optional)* Docker & Docker Compose (if testing against PostgreSQL instead of default SQLite)

---

### 1. Backend Setup

The backend defaults to a zero-configuration SQLite database (`sqlite:///./sutramind.db`), making it runnable immediately without setting up external servers.

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create local environment config
cp .env.example .env

# Initialize database schema and seed demo data
python -m app.seed

# Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```

The API will be live at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Create environment configuration
cp .env.example .env.local

# Launch Vite development server
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

### 3. Optional: Running with PostgreSQL via Docker

If you wish to run SutraMind against PostgreSQL rather than SQLite:

```bash
# Start PostgreSQL container
docker compose up -d db

# Update backend/.env:
# DATABASE_URL=postgresql+psycopg://sutramind:sutramind_local_only@localhost:5432/sutramind

# Run seed and start server
cd backend
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

---

### 4. Production deploy (frontend + FastAPI)

Vercel hosts the React app only. FastAPI needs its own service (Render or Railway).

**Backend (Render)**

1. Push this repo to GitHub.
2. Open [Render](https://render.com), click **New → Blueprint**, and connect `Vaasu08/SutraMind`.
3. Apply `render.yaml`. That creates `sutramind-api` with demo seed data on boot.
4. After deploy, copy the service URL, for example `https://sutramind-api.onrender.com`.
5. Confirm `https://YOUR-API.onrender.com/health` returns `{"status":"ok"}` and `/docs` shows Swagger.

Optional: attach Render PostgreSQL and set `DATABASE_URL` to the connection string. The app rewrites `postgres://` to SQLAlchemy’s `postgresql+psycopg://` driver automatically.

**Frontend (Vercel)**

1. In the Vercel project go to **Settings → Environment Variables**.
2. Add `VITE_API_BASE_URL` = `https://YOUR-API.onrender.com/api/v1` (Production and Preview).
3. Redeploy the frontend so Vite bakes in the API URL.

CORS already allows `http://localhost:5173` and `https://*.vercel.app`. If you use a custom domain, add it to the backend `CORS_ORIGINS` env var (comma-separated).

**Railway alternative:** New project → Deploy from GitHub → this repo. `railway.toml` builds the root `Dockerfile` and listens on `$PORT`.

---

## 👥 Demo Accounts & Pre-Seeded Roles

All demo accounts are pre-seeded with the password: **`Demo@123`**

| Role | Email | Permissions / Focus Area |
| :--- | :--- | :--- |
| **Admin** | `admin@sutramind.local` | System configuration, Master Dictionary management, user accounts |
| **Principal Investigator** | `pi@sutramind.local` | Protocol definition, IEC submissions, query final sign-off |
| **Study Coordinator** | `coordinator@sutramind.local` | Participant intake, Prakriti assessment, visit scheduling, eCRF recording |
| **Monitor (CRA)** | `monitor@sutramind.local` | Site monitoring, source data verification, raising queries |
| **Ethics Committee** | `ethics@sutramind.local` | Ethical review status, trial approvals, meeting minutes |
| **Pharmacovigilance** | `pv@sutramind.local` | Safety surveillance, adverse event signals |

> [!NOTE]
> All seeded trial and participant records are synthetic and created specifically for demonstration purposes.

---

## 🧪 Verification & Testing

### Backend Automated Test Suite
To run the automated test suite verifying auth, RBAC permissions, participant enrollment, baseline CRF, query lifecycle, ethics review, and analytics KPIs:

```bash
cd backend
source .venv/bin/activate
pytest tests/test_phase1.py -v
```

### Frontend Build & Typecheck
To ensure clean TypeScript compilation and lint compliance:

```bash
cd frontend
npm run lint
npm run build
```

---

## 📖 Planning & Architectural Documentation

Detailed architectural and regulatory specifications are maintained in the [`INFO/`](INFO/) directory:

- [**INFO/README.md**](INFO/README.md) — Documentation index and design decisions.
- [**Phase 1 Scope & Success Criteria**](INFO/phase-1/01-scope-success.md) — Defined deliverables and verification goals.
- [**System Architecture & Security**](INFO/phase-1/02-architecture.md) — Backend-authoritative security model, CORS, and deployment topology.
- [**Data Model Specification**](INFO/phase-1/03-data-model.md) — Full relational schema definitions and dictionary tables.
- [**RBAC Matrix & Workflows**](INFO/phase-1/04-rbac-workflows.md) — Complete permission mappings across all roles.
- [**CRF Validation Rules**](INFO/phase-1/05-crf-validation.md) — Clinical check rules and validation boundaries.
- [**REST API Contract**](INFO/phase-1/06-api-contract.md) — HTTP verbs, request/response models, and error statuses.
- [**Prototype & Judge Walkthrough**](INFO/phase-1/07-prototype-spec.md) — Step-by-step evaluation guide for competition judges.
- [**Sprint Execution Plan**](INFO/phase-1/08-execution-plan.md) — Milestone breakdown and release checklist.
- [**Ayurvedic UI Playbook**](INFO/phase-1/09-local-ui-execution-playbook.md) — Botanical design system tokens, color palettes, and component hierarchy.
- [**Phase 2 & 3 Roadmap**](INFO/roadmap-phase-2-3.md) — Future evolution for Panchakarma tracking, CDISC/SDTM export, MedDRA coding, and mobile sync.

---

## ⚖️ License & Attribution

Developed for the Smart India Hackathon (SIH) prototype submission. Confidential & Proprietary.


