"""Idempotent synthetic demo data for the SutraMind Phase 1 prototype."""

import json
from datetime import date, datetime, timedelta
from pathlib import Path

from sqlalchemy import select

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import AyurvedaBaseline, CRF, DataQuery, EthicsReview, MasterTerm, Medicine, Participant, Protocol, Site, Study, StudyMembership, User, Visit


DEMO_PASSWORD = "Demo@123"


def get_or_create_user(db, name: str, email: str, role: str) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user:
        return user
    user = User(name=name, email=email, password_hash=hash_password(DEMO_PASSWORD), role=role)
    db.add(user)
    db.flush()
    return user


def seed_master_terms(db) -> int:
    path = Path(__file__).resolve().parents[2] / "INFO" / "reference-data" / "ayurveda-master-dictionary.json"
    payload = json.loads(path.read_text())
    created = 0
    for item in payload["terms"]:
        category = item["category"].upper()
        term = db.scalar(select(MasterTerm).where(MasterTerm.category == category, MasterTerm.code == item["code"]))
        if term:
            continue
        db.add(MasterTerm(
            category=category,
            code=item["code"],
            label_en=item["label_en"],
            label_hi=item["label_hi"],
            modern_mapping_en=item.get("modern_mapping_en"),
            active=item.get("active", True),
            sort_order=created,
        ))
        created += 1
    return created


def seed() -> dict[str, int]:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        counters = {"terms": seed_master_terms(db), "users": 0, "studies": 0, "participants": 0}
        users = {
            "ADMIN": get_or_create_user(db, "Aditi Nair", "admin@sutramind.local", "ADMIN"),
            "PI": get_or_create_user(db, "Dr. Ananya Sharma", "pi@sutramind.local", "PI"),
            "COORDINATOR": get_or_create_user(db, "Kavita Rao", "coordinator@sutramind.local", "COORDINATOR"),
            "MONITOR": get_or_create_user(db, "Rahul Mehta", "monitor@sutramind.local", "MONITOR"),
            "ETHICS": get_or_create_user(db, "Prof. Meera Iyer", "ethics@sutramind.local", "ETHICS"),
            "PV": get_or_create_user(db, "Dr. Neha Verma", "pv@sutramind.local", "PV"),
        }
        counters["users"] = len(users)
        medicine = db.scalar(select(Medicine).where(Medicine.medicine_code == "MED001"))
        if not medicine:
            medicine = Medicine(medicine_code="MED001", ayurveda_name="Yogaraja Guggulu", dosage_form_code="DF01")
            db.add(medicine)
            db.flush()
        study = db.scalar(select(Study).where(Study.study_code == "AMAVATA-001"))
        if not study:
            today = date.today()
            study = Study(
                study_code="AMAVATA-001",
                title="Yogaraja Guggulu in Amavata: an Ayurveda Clinical Trial",
                short_title="Yogaraja Guggulu in Amavata",
                pi_id=users["PI"].id,
                institution="All India Institute of Ayurveda (Demo)",
                trial_phase="Phase II",
                sample_size=120,
                start_date=today - timedelta(days=30),
                end_date=today + timedelta(days=150),
                status="ACTIVE",
                ctri_number="CTRI/DEMO/2026/001",
            )
            db.add(study)
            db.flush()
            counters["studies"] += 1
            site = Site(study_id=study.id, site_code="AIIA-ND", name="AIIA, New Delhi", address="New Delhi, India")
            db.add(site)
            db.flush()
            db.add_all([
                StudyMembership(study_id=study.id, user_id=users["PI"].id, role_in_study="PI"),
                StudyMembership(study_id=study.id, user_id=users["COORDINATOR"].id, site_id=site.id, role_in_study="COORDINATOR"),
                StudyMembership(study_id=study.id, user_id=users["MONITOR"].id, role_in_study="MONITOR"),
                StudyMembership(study_id=study.id, user_id=users["ETHICS"].id, role_in_study="ETHICS"),
                StudyMembership(study_id=study.id, user_id=users["PV"].id, role_in_study="PV"),
            ])
            db.add(Protocol(
                study_id=study.id, version="1.0", modern_diagnosis="Rheumatoid Arthritis", vyadhi_code="V001",
                intervention_name="Yogaraja Guggulu", medicine_id=medicine.id, dosage_form_code="DF01",
                anupana_code="AN01", treatment_duration_days=90,
                summary="A synthetic demonstration study for structured Ayurveda research data.",
            ))
            db.add(EthicsReview(
                study_id=study.id, iec_number="AIIA-IEC-DEMO-001", status="APPROVED",
                approval_date=today - timedelta(days=28), expiry_date=today + timedelta(days=337),
                remarks="Synthetic Phase 1 prototype ethics record.", updated_by=users["ETHICS"].id,
            ))
        else:
            site = db.scalar(select(Site).where(Site.study_id == study.id))
        participant = db.scalar(select(Participant).where(Participant.study_id == study.id, Participant.participant_code == "AMV-001"))
        if not participant:
            participant = Participant(
                participant_code="AMV-001", study_id=study.id, site_id=site.id, name="Demo Participant 001",
                age=42, gender="FEMALE", modern_diagnosis="Rheumatoid Arthritis", vyadhi_code="V001",
                disease_duration_months=24, randomization_id="R-001", enrollment_date=date.today() - timedelta(days=21),
                status="ENROLLED", created_by=users["COORDINATOR"].id,
            )
            db.add(participant)
            db.flush()
            counters["participants"] += 1
            db.add(AyurvedaBaseline(
                participant_id=participant.id, prakriti_code="P6", vikriti_notes="Sandhi shoola and morning stiffness at baseline.",
                agni_code="A2", bala_code="B2", satva_code="S2", recorded_by=users["COORDINATOR"].id,
            ))
            baseline_visit = Visit(
                participant_id=participant.id, visit_number=0, scheduled_date=date.today() - timedelta(days=21),
                visit_date=date.today() - timedelta(days=21), status="COMPLETED", investigator_id=users["PI"].id,
                created_by=users["COORDINATOR"].id,
            )
            db.add(baseline_visit)
            db.flush()
            visit = Visit(
                participant_id=participant.id, visit_number=1, scheduled_date=date.today() - timedelta(days=1),
                visit_date=date.today() - timedelta(days=1), status="COMPLETED", investigator_id=users["PI"].id,
                created_by=users["COORDINATOR"].id,
            )
            db.add(visit)
            db.flush()
            crf = CRF(
                visit_id=visit.id, systolic_bp=118, diastolic_bp=76, pulse_bpm=72, weight_kg=58.4,
                temperature_c=36.8, agni_code="A1", bala_code="B2", symptoms="Morning stiffness reduced.",
                medicine_id=medicine.id, dose="500 mg", frequency="BD", compliance="YES",
                remarks="Synthetic completed CRF for the demo.", completion_status="COMPLETED",
                completed_by=users["COORDINATOR"].id, completed_at=datetime.utcnow(),
            )
            db.add(crf)
            next_visit = Visit(
                participant_id=participant.id, visit_number=2, scheduled_date=date.today() + timedelta(days=27),
                status="SCHEDULED", investigator_id=users["PI"].id, created_by=users["COORDINATOR"].id,
            )
            db.add(next_visit)
            db.flush()
            db.add(DataQuery(
                study_id=study.id, target_type="CRF", target_id=crf.id, field_name="weight_kg",
                message="Please confirm the recorded weight against the source record.", status="OPEN",
                raised_by=users["MONITOR"].id,
            ))
        db.commit()
        return counters
    finally:
        db.close()


if __name__ == "__main__":
    result = seed()
    print("SutraMind demo seed complete:", ", ".join(f"{key}={value}" for key, value in result.items()))

