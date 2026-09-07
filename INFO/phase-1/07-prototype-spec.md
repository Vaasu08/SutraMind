# Required Phase 1 Prototype Specification

## Prototype promise

The prototype is not a clickable slideshow. It is a working, seeded web application where data created in one role is visible and actionable in the next role's workflow.

## Navigation: seven primary authenticated pages

| Page | Key capabilities | Roles |
| --- | --- | --- |
| 1. Dashboard | Role-aware cards, selected-study KPIs, recruitment progress, ethics badge, charts. | All scoped roles (PV metadata only). |
| 2. Studies | List/create study, status filters, study detail tabs. | Admin, PI; scoped view for other authorised roles. |
| 3. Participants | Pseudonymised registry list, filters, enrollment form drawer/page. | Coordinator, PI, Monitor; scope dependent. |
| 4. Participant Profile | Demographics, clinical info, Ayurveda baseline, visit timeline, query count. | Coordinator, PI, Monitor. |
| 5. Visits and CRF | Schedule visit; draft/complete real digital CRF. | Coordinator edit; PI/Monitor view. |
| 6. Queries | Queue, target link, raise/answer/close state controls. | Monitor, Coordinator, PI. |
| 7. Administration | User assignment and Ayurveda master dictionary maintenance. | Admin; ethics panel visible only to Ethics role. |

Unauthenticated entry is a dedicated **Login** page with email, password, language toggle, validation errors, and post-login role-aware redirect. Recruitment dashboard is a Dashboard panel rather than an eighth top-level page. Study-detail tabs host Protocol, Sites, and Ethics so the navigation remains focused.

## Screen-level requirements

### Login

- English/Hindi toggle before authentication.
- Demo accounts/cards may autofill only in a strictly local demo build.
- Show generic invalid-credential error; never reveal whether an email exists.

### Dashboard

- Selected study filter; PI/Admin can switch studies they can access.
- Cards: Active Studies, Recruitment (`68 / 120` style), Pending Queries, Ethics Status, Visit Completion.
- Charts/cards: Prakriti distribution (`V 22 • P 18 • K 28` style), Vyadhi distribution (for example Amavata 64%), medicine adherence (for example 91%).
- Every metric links to filtered underlying records where the user's permission permits it.

### Study creation/detail

Required fields: title, study code, PI, institution, trial phase text, sample size, start/end dates, Vyadhi, modern diagnosis, intervention, dosage form, Anupana, treatment duration, IEC number, CTRI number (optional), ethics status.

The user-provided trial phase and CTRI data are maintained in the UI/model extension even though minimal earlier schemas did not list them. `ctri_number` is optional; no registry submission integration is claimed.

### Participant enrollment/profile

- Four visual sections: Demographics, Clinical, Ayurveda Baseline, Trial.
- All Ayurveda selections are dropdowns populated from API master terms.
- Profile shows a non-editable baseline summary next to visit history.
- Participant list/search uses code, site, status, Vyadhi, and enrollment date; names do not appear in dashboard cards.

### Visit / CRF

- Timeline presents Scheduled, Completed, and Missed states.
- A prominent `Save Draft` and `Complete CRF` distinction prevents a form-looking prototype that does not persist workflow state.
- CRF uses the sections and validation defined in [05-crf-validation.md](05-crf-validation.md).
- Query indicators beside affected fields link directly to the Query workspace.

### Query workspace

- Monitor starts with a study filter and a `Raise Query` action from CRF/profile field context.
- Coordinator sees `OPEN` queries assigned to their study/site and can add answer text.
- PI sees `ANSWERED` queries and can close them.
- Status chips: Open, Answered, Closed; include raiser/answerer dates.

### Administration and ethics

- Admin: create/disable users, study/site assignments, add/update/deactivate master terms.
- Ethics: a constrained study panel for IEC number, decision, approval/expiry dates, and remarks.
- A non-admin cannot reach administration routes even through a copied URL.

## Bilingual implementation

```text
frontend/src/locales/en.json
frontend/src/locales/hi.json
```

- Translate navigation, buttons, form labels, validation errors, empty states, statuses, and dictionary labels.
- Persist ISO dates, UUIDs, numeric measurements, and dictionary codes—not translated text.
- Use a system font stack with Devanagari support and test labels at mobile width.
- Keep Sanskrit/transliterated clinical labels alongside Hindi where it improves recognition, for example `Agni (अग्नि)`.

## Required seeded demo scenario

Seed only synthetic records:

| Item | Demo value |
| --- | --- |
| Study | `AMAVATA-001`, 120 sample target, Yogaraja Guggulu in Amavata. |
| Protocol | `V001` Amavata / rheumatoid arthritis, `DF01` Vati, `AN01` Ushna Jala, 90 days. |
| Participant | `AMV-001`, age 42, Vata-Kapha (`P6`), Vishama Agni (`A2`), Madhyama Bala/Satva. |
| Visit | Visit 1 scheduled, then completed with `A1` Sama Agni and compliance `YES`. |
| Query | Monitor flags a CRF data point; Coordinator answers; PI closes it. |
| Roles | One active user each for Admin, PI, Coordinator, Monitor, Ethics, and PV. |

## Demo script (under five minutes)

1. Log in as PI and show the active-study dashboard and Ayurveda-specific KPIs.
2. Open the Amavata study and point out controlled Vyadhi, formulation, dosage form, and Anupana—not free text.
3. Log in as Coordinator, enroll a synthetic participant, and record Prakriti/Agni/Bala/Satva.
4. Schedule and complete Visit 1; show vitals, Ayurveda visit assessment, Yogaraja Guggulu dose, and compliance.
5. Log in as Monitor, raise a query on the visit CRF; return as Coordinator to answer it, then as PI to close it.
6. Switch to Hindi and show that both UI and Ayurveda dictionary labels change while the participant's code/data remains intact.
7. Return to dashboard and show the updated recruitment/completion/adherence metrics.

## Prototype acceptance criteria

- No mocked-only buttons on the success path: each action uses the API and persists after refresh.
- Role-specific attempts made by direct API call are rejected.
- All Phase 1 dropdown values come from `master_terms` seed/API, not hard-coded form arrays.
- The demo flow runs with a fresh seeded database in a single command or documented startup sequence.
- Responsive layout works at approximately 1280px desktop and 390px mobile viewport without hiding required form controls.
