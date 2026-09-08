from collections import Counter
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, verify_password
from app.config import settings
from app.database import Base, engine, get_db
from app.models import (
    AyurvedaBaseline,
    CRF,
    DataQuery,
    EthicsReview,
    MasterTerm,
    Medicine,
    Participant,
    Protocol,
    Site,
    Study,
    StudyMembership,
    User,
    Visit,
)
from app.permissions import accessible_study_ids, require_permission, require_site_belongs_to_study, require_study_access
from app.schemas import (
    CRFInput,
    EthicsInput,
    LoginRequest,
    MasterTermCreate,
    MasterTermUpdate,
    ParticipantCreate,
    ParticipantUpdate,
    QueryCreate,
    QueryUpdate,
    StudyCreate,
    StudyUpdate,
    UserCreate,
    VisitCreate,
    VisitUpdate,
)


app = FastAPI(title="SutraMind Phase 1 API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    """Keeps the demo usable before Alembic is introduced in deployment."""
    Base.metadata.create_all(bind=engine)
    if settings.seed_on_startup:
        from app.seed import seed

        seed()


def data(payload: object, meta: dict | None = None) -> dict:
    response = {"data": payload}
    if meta is not None:
        response["meta"] = meta
    return response


def user_view(user: User) -> dict:
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "is_active": user.is_active}


def term_view(term: MasterTerm) -> dict:
    return {
        "id": term.id, "category": term.category, "code": term.code,
        "label_en": term.label_en, "label_hi": term.label_hi,
        "modern_mapping_en": term.modern_mapping_en, "active": term.active, "sort_order": term.sort_order,
    }


def site_view(site: Site) -> dict:
    return {"id": site.id, "study_id": site.study_id, "site_code": site.site_code, "name": site.name, "address": site.address, "is_active": site.is_active}


def medicine_view(medicine: Medicine) -> dict:
    return {"id": medicine.id, "medicine_code": medicine.medicine_code, "ayurveda_name": medicine.ayurveda_name, "dosage_form_code": medicine.dosage_form_code, "is_active": medicine.is_active}


def study_view(db: Session, study: Study, detail: bool = False) -> dict:
    enrolled_count = db.scalar(
        select(func.count()).select_from(Participant).where(
            Participant.study_id == study.id,
            Participant.status.in_(["SUBMITTED", "ENROLLED", "COMPLETED"]),
        )
    ) or 0
    payload = {
        "id": study.id, "study_code": study.study_code, "title": study.title, "short_title": study.short_title,
        "pi_id": study.pi_id, "institution": study.institution, "trial_phase": study.trial_phase,
        "sample_size": study.sample_size, "start_date": study.start_date, "end_date": study.end_date,
        "status": study.status, "ctri_number": study.ctri_number, "participant_count": enrolled_count,
    }
    if detail:
        protocol = db.scalar(select(Protocol).where(Protocol.study_id == study.id, Protocol.is_active.is_(True)))
        ethics = db.scalar(select(EthicsReview).where(EthicsReview.study_id == study.id))
        payload["protocol"] = protocol_view(protocol) if protocol else None
        payload["ethics"] = ethics_view(ethics) if ethics else None
        payload["sites"] = [site_view(site) for site in db.scalars(select(Site).where(Site.study_id == study.id)).all()]
    return payload


def protocol_view(protocol: Protocol) -> dict:
    return {
        "id": protocol.id, "study_id": protocol.study_id, "version": protocol.version, "is_active": protocol.is_active,
        "modern_diagnosis": protocol.modern_diagnosis, "vyadhi_code": protocol.vyadhi_code,
        "intervention_name": protocol.intervention_name, "medicine_id": protocol.medicine_id,
        "dosage_form_code": protocol.dosage_form_code, "anupana_code": protocol.anupana_code,
        "treatment_duration_days": protocol.treatment_duration_days, "summary": protocol.summary,
    }


def ethics_view(ethics: EthicsReview) -> dict:
    return {
        "id": ethics.id, "study_id": ethics.study_id, "iec_number": ethics.iec_number, "status": ethics.status,
        "approval_date": ethics.approval_date, "expiry_date": ethics.expiry_date, "remarks": ethics.remarks,
        "updated_at": ethics.updated_at,
    }


def participant_view(db: Session, participant: Participant, detail: bool = False) -> dict:
    site = db.get(Site, participant.site_id)
    visits = db.scalars(select(Visit).where(Visit.participant_id == participant.id).order_by(Visit.visit_number)).all()
    current_visit = visits[-1] if visits else None
    payload = {
        "id": participant.id, "participant_code": participant.participant_code, "study_id": participant.study_id,
        "site_id": participant.site_id, "site_name": site.name if site else None, "name": participant.name,
        "age": participant.age, "gender": participant.gender, "modern_diagnosis": participant.modern_diagnosis,
        "vyadhi_code": participant.vyadhi_code, "disease_duration_months": participant.disease_duration_months,
        "randomization_id": participant.randomization_id, "enrollment_date": participant.enrollment_date,
        "status": participant.status, "current_visit": current_visit.visit_number if current_visit else None,
    }
    if detail:
        baseline = db.scalar(select(AyurvedaBaseline).where(AyurvedaBaseline.participant_id == participant.id))
        payload["baseline"] = baseline_view(baseline) if baseline else None
        payload["visits"] = [visit_view(db, visit) for visit in visits]
        payload["open_query_count"] = db.scalar(
            select(func.count()).select_from(DataQuery).where(DataQuery.study_id == participant.study_id, DataQuery.status != "CLOSED")
        ) or 0
    return payload


def baseline_view(baseline: AyurvedaBaseline) -> dict:
    return {
        "id": baseline.id, "participant_id": baseline.participant_id, "prakriti_code": baseline.prakriti_code,
        "vikriti_notes": baseline.vikriti_notes, "agni_code": baseline.agni_code, "bala_code": baseline.bala_code,
        "satva_code": baseline.satva_code, "recorded_at": baseline.recorded_at,
    }


def visit_view(db: Session, visit: Visit) -> dict:
    crf = db.scalar(select(CRF).where(CRF.visit_id == visit.id))
    return {
        "id": visit.id, "participant_id": visit.participant_id, "visit_number": visit.visit_number,
        "visit_date": visit.visit_date, "scheduled_date": visit.scheduled_date, "next_visit_date": visit.next_visit_date,
        "status": visit.status, "investigator_id": visit.investigator_id, "crf_id": crf.id if crf else None,
        "crf_completion_status": crf.completion_status if crf else None,
    }


def crf_view(crf: CRF) -> dict:
    return {
        "id": crf.id, "visit_id": crf.visit_id, "systolic_bp": crf.systolic_bp, "diastolic_bp": crf.diastolic_bp,
        "pulse_bpm": crf.pulse_bpm, "weight_kg": crf.weight_kg, "temperature_c": crf.temperature_c,
        "agni_code": crf.agni_code, "bala_code": crf.bala_code, "symptoms": crf.symptoms,
        "medicine_id": crf.medicine_id, "dose": crf.dose, "frequency": crf.frequency,
        "compliance": crf.compliance, "remarks": crf.remarks, "completion_status": crf.completion_status,
        "completed_at": crf.completed_at,
    }


def query_view(db: Session, query: DataQuery) -> dict:
    raiser = db.get(User, query.raised_by)
    answerer = db.get(User, query.answered_by) if query.answered_by else None
    participant_code = None
    if query.target_type == "PARTICIPANT":
        participant = db.get(Participant, query.target_id)
        participant_code = participant.participant_code if participant else None
    if query.target_type in {"VISIT", "CRF"}:
        visit = db.get(Visit, query.target_id) if query.target_type == "VISIT" else None
        if query.target_type == "CRF":
            crf = db.get(CRF, query.target_id)
            visit = db.get(Visit, crf.visit_id) if crf else None
        if visit:
            participant = db.get(Participant, visit.participant_id)
            participant_code = participant.participant_code if participant else None
    return {
        "id": query.id, "study_id": query.study_id, "target_type": query.target_type, "target_id": query.target_id,
        "field_name": query.field_name, "message": query.message, "status": query.status,
        "raised_by": query.raised_by, "raised_by_name": raiser.name if raiser else "Unknown", "raised_at": query.raised_at,
        "answer": query.answer, "answered_by": query.answered_by, "answered_by_name": answerer.name if answerer else None,
        "answered_at": query.answered_at, "closed_at": query.closed_at, "participant_code": participant_code,
    }


def assert_active_term(db: Session, category: str, code: str | None) -> None:
    if not code:
        return
    term = db.scalar(select(MasterTerm).where(MasterTerm.category == category.upper(), MasterTerm.code == code.upper(), MasterTerm.active.is_(True)))
    if not term:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Unknown or inactive {category} code: {code}")


def participant_for_visit(db: Session, visit_id: str) -> tuple[Visit, Participant]:
    visit = db.get(Visit, visit_id)
    if not visit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit not found")
    participant = db.get(Participant, visit.participant_id)
    if not participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant not found")
    return visit, participant


def target_study_id(db: Session, target_type: str, target_id: str) -> str:
    if target_type == "PARTICIPANT":
        participant = db.get(Participant, target_id)
        if participant:
            return participant.study_id
    elif target_type == "BASELINE":
        baseline = db.get(AyurvedaBaseline, target_id)
        if baseline:
            participant = db.get(Participant, baseline.participant_id)
            if participant:
                return participant.study_id
    elif target_type == "VISIT":
        _, participant = participant_for_visit(db, target_id)
        return participant.study_id
    elif target_type == "CRF":
        crf = db.get(CRF, target_id)
        if crf:
            _, participant = participant_for_visit(db, crf.visit_id)
            return participant.study_id
    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Query target is invalid")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/v1/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return data({"access_token": create_access_token(user), "token_type": "bearer", "user": user_view(user)})


@app.get("/api/v1/auth/me")
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    memberships = db.scalars(select(StudyMembership).where(StudyMembership.user_id == current_user.id, StudyMembership.is_active.is_(True))).all()
    return data({**user_view(current_user), "study_ids": sorted(accessible_study_ids(db, current_user)), "memberships": [{"study_id": item.study_id, "site_id": item.site_id, "role_in_study": item.role_in_study} for item in memberships]})


@app.get("/api/v1/master-terms")
def list_master_terms(category: str | None = None, include_inactive: bool = False, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "master:read")
    statement = select(MasterTerm).order_by(MasterTerm.category, MasterTerm.sort_order, MasterTerm.label_en)
    if category:
        statement = statement.where(MasterTerm.category == category.upper())
    if not include_inactive:
        statement = statement.where(MasterTerm.active.is_(True))
    return data([term_view(term) for term in db.scalars(statement).all()])


@app.post("/api/v1/master-terms", status_code=status.HTTP_201_CREATED)
def create_master_term(payload: MasterTermCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "master:manage")
    term = MasterTerm(**payload.model_dump())
    db.add(term)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Master term code already exists") from exc
    db.refresh(term)
    return data(term_view(term))


@app.patch("/api/v1/master-terms/{term_id}")
def update_master_term(term_id: str, payload: MasterTermUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "master:manage")
    term = db.get(MasterTerm, term_id)
    if not term:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Master term not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(term, field, value)
    db.commit()
    db.refresh(term)
    return data(term_view(term))


@app.get("/api/v1/medicines")
def list_medicines(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "master:read")
    return data([medicine_view(item) for item in db.scalars(select(Medicine).where(Medicine.is_active.is_(True)).order_by(Medicine.ayurveda_name)).all()])


@app.get("/api/v1/studies")
def list_studies(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "study:read")
    ids = accessible_study_ids(db, current_user)
    studies = db.scalars(select(Study).where(Study.id.in_(ids)).order_by(Study.created_at.desc())).all() if ids else []
    return data([study_view(db, study) for study in studies])


@app.post("/api/v1/studies", status_code=status.HTTP_201_CREATED)
def create_study(payload: StudyCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "study:create")
    pi_id = payload.pi_id or current_user.id
    if current_user.role == "PI" and pi_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="A PI can create only their own study")
    pi = db.get(User, pi_id)
    if not pi or pi.role != "PI" or not pi.is_active:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="A valid active PI is required")
    assert_active_term(db, "VYADHI", payload.protocol.vyadhi_code)
    assert_active_term(db, "DOSAGE_FORM", payload.protocol.dosage_form_code)
    assert_active_term(db, "ANUPANA", payload.protocol.anupana_code)
    if payload.protocol.medicine_id and not db.get(Medicine, payload.protocol.medicine_id):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Selected medicine does not exist")
    study = Study(
        study_code=payload.study_code, title=payload.title, short_title=payload.short_title, pi_id=pi_id,
        institution=payload.institution, trial_phase=payload.trial_phase, sample_size=payload.sample_size,
        start_date=payload.start_date, end_date=payload.end_date, ctri_number=payload.ctri_number,
    )
    try:
        db.add(study)
        db.flush()
        site_by_code: dict[str, Site] = {}
        for site_input in payload.sites:
            site = Site(study_id=study.id, **site_input.model_dump())
            db.add(site)
            db.flush()
            site_by_code[site.site_code.upper()] = site
        db.add(StudyMembership(study_id=study.id, user_id=pi_id, role_in_study="PI"))
        for membership_input in payload.memberships:
            assigned_user = db.get(User, membership_input.user_id)
            if not assigned_user or not assigned_user.is_active:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Assigned team member is not active")
            site_id = None
            if membership_input.site_code:
                site = site_by_code.get(membership_input.site_code.upper())
                if not site:
                    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Membership site code is not in this study")
                site_id = site.id
            db.add(StudyMembership(study_id=study.id, user_id=assigned_user.id, site_id=site_id, role_in_study=membership_input.role_in_study))
        db.add(Protocol(study_id=study.id, **payload.protocol.model_dump()))
        db.add(EthicsReview(study_id=study.id, **payload.ethics.model_dump(), updated_by=current_user.id))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Study code or team assignment already exists") from exc
    db.refresh(study)
    return data(study_view(db, study, detail=True))


@app.get("/api/v1/studies/{study_id}")
def get_study(study_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "study:read")
    study = require_study_access(db, current_user, study_id)
    return data(study_view(db, study, detail=True))


@app.patch("/api/v1/studies/{study_id}")
def update_study(study_id: str, payload: StudyUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "study:edit")
    study = require_study_access(db, current_user, study_id)
    if current_user.role == "PI" and study.pi_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the assigned PI may edit this study")
    changes = payload.model_dump(exclude_unset=True)
    new_start = changes.get("start_date", study.start_date)
    new_end = changes.get("end_date", study.end_date)
    if new_end < new_start:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="End date cannot be before start date")
    if changes.get("status") == "ACTIVE":
        ethics = db.scalar(select(EthicsReview).where(EthicsReview.study_id == study.id))
        if not ethics or ethics.status != "APPROVED":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Study requires approved ethics before activation")
    for field, value in changes.items():
        setattr(study, field, value)
    db.commit()
    return data(study_view(db, study, detail=True))


@app.patch("/api/v1/ethics/{study_id}")
def update_ethics(study_id: str, payload: EthicsInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "ethics:write")
    require_study_access(db, current_user, study_id)
    ethics = db.scalar(select(EthicsReview).where(EthicsReview.study_id == study_id))
    if not ethics:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ethics record not found")
    for field, value in payload.model_dump().items():
        setattr(ethics, field, value)
    ethics.updated_by = current_user.id
    db.commit()
    return data(ethics_view(ethics))


@app.get("/api/v1/participants")
def list_participants(study_id: str | None = None, status_filter: str | None = Query(default=None, alias="status"), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "participant:read")
    ids = accessible_study_ids(db, current_user)
    statement = select(Participant).where(Participant.study_id.in_(ids))
    if study_id:
        require_study_access(db, current_user, study_id)
        statement = statement.where(Participant.study_id == study_id)
    if status_filter:
        statement = statement.where(Participant.status == status_filter.upper())
    participants = db.scalars(statement.order_by(Participant.enrollment_date.desc())).all()
    return data([participant_view(db, participant) for participant in participants])


@app.post("/api/v1/participants", status_code=status.HTTP_201_CREATED)
def create_participant(payload: ParticipantCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "participant:create")
    study = require_study_access(db, current_user, payload.study_id, payload.site_id)
    require_site_belongs_to_study(db, study.id, payload.site_id)
    assert_active_term(db, "VYADHI", payload.vyadhi_code)
    assert_active_term(db, "PRAKRITI", payload.baseline.prakriti_code)
    assert_active_term(db, "AGNI", payload.baseline.agni_code)
    assert_active_term(db, "BALA", payload.baseline.bala_code)
    assert_active_term(db, "SATVA", payload.baseline.satva_code)
    enrolled_count = db.scalar(
        select(func.count()).select_from(Participant).where(
            Participant.study_id == study.id,
            Participant.status.in_(["SUBMITTED", "ENROLLED", "COMPLETED"]),
        )
    ) or 0
    if enrolled_count >= study.sample_size:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Study recruitment target has been reached")
    participant_data = payload.model_dump(exclude={"baseline"})
    participant = Participant(**participant_data, created_by=current_user.id, status="SUBMITTED")
    try:
        db.add(participant)
        db.flush()
        db.add(AyurvedaBaseline(participant_id=participant.id, **payload.baseline.model_dump(), recorded_by=current_user.id))
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Participant code or randomisation ID already exists in this study") from exc
    db.refresh(participant)
    return data(participant_view(db, participant, detail=True))


@app.get("/api/v1/participants/{participant_id}")
def get_participant(participant_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "participant:read")
    participant = db.get(Participant, participant_id)
    if not participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant not found")
    require_study_access(db, current_user, participant.study_id, participant.site_id if current_user.role == "COORDINATOR" else None)
    return data(participant_view(db, participant, detail=True))


@app.patch("/api/v1/participants/{participant_id}")
def update_participant(participant_id: str, payload: ParticipantUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    permission = "participant:edit" if current_user.role == "COORDINATOR" else "participant:approve"
    require_permission(current_user, permission)
    participant = db.get(Participant, participant_id)
    if not participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant not found")
    require_study_access(db, current_user, participant.study_id, participant.site_id if current_user.role == "COORDINATOR" else None)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(participant, field, value)
    db.commit()
    return data(participant_view(db, participant, detail=True))


@app.post("/api/v1/visits", status_code=status.HTTP_201_CREATED)
def create_visit(payload: VisitCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "visit:create")
    participant = db.get(Participant, payload.participant_id)
    if not participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant not found")
    require_study_access(db, current_user, participant.study_id, participant.site_id)
    if payload.scheduled_date < participant.enrollment_date:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Visit cannot be scheduled before enrollment")
    visit = Visit(**payload.model_dump(), created_by=current_user.id)
    db.add(visit)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This visit number already exists for the participant") from exc
    return data(visit_view(db, visit))


@app.patch("/api/v1/visits/{visit_id}")
def update_visit(visit_id: str, payload: VisitUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "visit:edit")
    visit, participant = participant_for_visit(db, visit_id)
    require_study_access(db, current_user, participant.study_id, participant.site_id)
    if visit.status == "COMPLETED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Completed visit may only be corrected through CRF workflow")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(visit, field, value)
    db.commit()
    return data(visit_view(db, visit))


def apply_crf(crf: CRF, payload: CRFInput, visit: Visit, current_user: User) -> None:
    investigator_id = payload.investigator_id or visit.investigator_id or current_user.id
    required_on_complete = [
        payload.visit_date, investigator_id, payload.systolic_bp, payload.diastolic_bp, payload.pulse_bpm,
        payload.weight_kg, payload.agni_code, payload.bala_code, payload.symptoms, payload.medicine_id,
        payload.dose, payload.frequency, payload.compliance,
    ]
    if payload.completion_status == "COMPLETED" and any(value is None or value == "" for value in required_on_complete):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="All required CRF fields must be completed before submission")
    for field, value in payload.model_dump(exclude={"visit_id", "visit_date", "investigator_id"}).items():
        setattr(crf, field, value)
    if payload.completion_status == "COMPLETED":
        crf.completed_by = current_user.id
        crf.completed_at = datetime.utcnow()
        visit.visit_date = payload.visit_date
        visit.investigator_id = investigator_id
        visit.status = "COMPLETED"


@app.post("/api/v1/crfs", status_code=status.HTTP_201_CREATED)
def create_crf(payload: CRFInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "crf:write")
    visit, participant = participant_for_visit(db, payload.visit_id)
    require_study_access(db, current_user, participant.study_id, participant.site_id)
    if db.scalar(select(CRF).where(CRF.visit_id == visit.id)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A CRF already exists for this visit")
    assert_active_term(db, "AGNI", payload.agni_code)
    assert_active_term(db, "BALA", payload.bala_code)
    if payload.medicine_id and not db.get(Medicine, payload.medicine_id):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Selected medicine does not exist")
    crf = CRF(visit_id=visit.id)
    db.add(crf)
    apply_crf(crf, payload, visit, current_user)
    db.commit()
    return data(crf_view(crf))


@app.get("/api/v1/crfs/by-visit/{visit_id}")
def get_crf_for_visit(visit_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "crf:read")
    visit, participant = participant_for_visit(db, visit_id)
    require_study_access(db, current_user, participant.study_id, participant.site_id if current_user.role == "COORDINATOR" else None)
    crf = db.scalar(select(CRF).where(CRF.visit_id == visit.id))
    if not crf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CRF not found")
    return data(crf_view(crf))


@app.patch("/api/v1/crfs/{crf_id}")
def update_crf(crf_id: str, payload: CRFInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "crf:write")
    crf = db.get(CRF, crf_id)
    if not crf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CRF not found")
    if crf.visit_id != payload.visit_id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="CRF does not belong to supplied visit")
    visit, participant = participant_for_visit(db, crf.visit_id)
    require_study_access(db, current_user, participant.study_id, participant.site_id)
    if crf.completion_status == "COMPLETED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Completed CRF is read-only in Phase 1")
    assert_active_term(db, "AGNI", payload.agni_code)
    assert_active_term(db, "BALA", payload.bala_code)
    apply_crf(crf, payload, visit, current_user)
    db.commit()
    return data(crf_view(crf))


@app.get("/api/v1/queries")
def list_queries(study_id: str | None = None, status_filter: str | None = Query(default=None, alias="status"), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "query:read")
    ids = accessible_study_ids(db, current_user)
    statement = select(DataQuery).where(DataQuery.study_id.in_(ids))
    if study_id:
        require_study_access(db, current_user, study_id)
        statement = statement.where(DataQuery.study_id == study_id)
    if status_filter:
        statement = statement.where(DataQuery.status == status_filter.upper())
    queries = db.scalars(statement.order_by(DataQuery.raised_at.desc())).all()
    return data([query_view(db, item) for item in queries])


@app.post("/api/v1/queries", status_code=status.HTTP_201_CREATED)
def create_query(payload: QueryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "query:raise")
    require_study_access(db, current_user, payload.study_id)
    if target_study_id(db, payload.target_type, payload.target_id) != payload.study_id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Query target is not part of selected study")
    query = DataQuery(**payload.model_dump(), raised_by=current_user.id)
    db.add(query)
    db.commit()
    return data(query_view(db, query))


@app.patch("/api/v1/queries/{query_id}")
def update_query(query_id: str, payload: QueryUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    query = db.get(DataQuery, query_id)
    if not query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Query not found")
    require_study_access(db, current_user, query.study_id)
    if payload.action == "ANSWER":
        require_permission(current_user, "query:answer")
        if query.status != "OPEN":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Only open queries can be answered")
        query.answer = payload.answer
        query.status = "ANSWERED"
        query.answered_by = current_user.id
        query.answered_at = datetime.utcnow()
    else:
        require_permission(current_user, "query:close")
        if query.status != "ANSWERED":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Only answered queries can be closed")
        query.status = "CLOSED"
        query.closed_by = current_user.id
        query.closed_at = datetime.utcnow()
    db.commit()
    return data(query_view(db, query))


@app.get("/api/v1/dashboard/overview")
def dashboard_overview(study_id: str | None = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "dashboard:read")
    ids = accessible_study_ids(db, current_user)
    if study_id:
        require_study_access(db, current_user, study_id)
        ids = {study_id}
    studies = db.scalars(select(Study).where(Study.id.in_(ids))).all() if ids else []
    participants = db.scalars(select(Participant).where(Participant.study_id.in_(ids))).all() if ids else []
    participant_ids = [participant.id for participant in participants]
    visits = db.scalars(select(Visit).where(Visit.participant_id.in_(participant_ids))).all() if participant_ids else []
    crfs = db.scalars(select(CRF).where(CRF.visit_id.in_([visit.id for visit in visits]))).all() if visits else []
    baselines = db.scalars(select(AyurvedaBaseline).where(AyurvedaBaseline.participant_id.in_(participant_ids))).all() if participant_ids else []
    queries = db.scalars(select(DataQuery).where(DataQuery.study_id.in_(ids))).all() if ids else []
    ethics = db.scalars(select(EthicsReview).where(EthicsReview.study_id.in_(ids))).all() if ids else []
    enrolled = [item for item in participants if item.status in {"SUBMITTED", "ENROLLED", "COMPLETED"}]
    completed_visits = [item for item in visits if item.status == "COMPLETED"]
    tracked_visits = [item for item in visits if item.status in {"SCHEDULED", "COMPLETED", "MISSED"}]
    compliant = [item for item in crfs if item.completion_status == "COMPLETED" and item.compliance == "YES"]
    compliance_denominator = [item for item in crfs if item.completion_status == "COMPLETED" and item.compliance]
    return data({
        "active_studies": len([item for item in studies if item.status == "ACTIVE"]),
        "study_count": len(studies), "total_participants": len(enrolled),
        "recruitment_target": sum(item.sample_size for item in studies),
        "completed_visits": len(completed_visits),
        "visit_completion_rate": round((len(completed_visits) / len(tracked_visits) * 100) if tracked_visits else 0, 1),
        "open_queries": len([item for item in queries if item.status != "CLOSED"]),
        "ethics_approved": len([item for item in ethics if item.status == "APPROVED"]),
        "ethics_status": ethics[0].status if len(ethics) == 1 else ("APPROVED" if ethics and all(item.status == "APPROVED" for item in ethics) else "MIXED"),
        "medicine_adherence": round((len(compliant) / len(compliance_denominator) * 100) if compliance_denominator else 0, 1),
        "prakriti_distribution": dict(Counter(item.prakriti_code for item in baselines)),
        "vyadhi_distribution": dict(Counter(item.vyadhi_code for item in enrolled)),
        "query_status": dict(Counter(item.status for item in queries)),
    })


@app.post("/api/v1/users", status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    require_permission(current_user, "user:manage")
    from app.auth import hash_password
    user = User(name=payload.name, email=str(payload.email).lower(), password_hash=hash_password(payload.password), role=payload.role)
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists") from exc
    return data(user_view(user))

