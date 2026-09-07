import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def uuid_str() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Study(TimestampMixin, Base):
    __tablename__ = "studies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    study_code: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(500))
    short_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    pi_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    institution: Mapped[str] = mapped_column(String(255))
    trial_phase: Mapped[str | None] = mapped_column(String(80), nullable=True)
    sample_size: Mapped[int] = mapped_column(Integer)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(24), default="DRAFT")
    ctri_number: Mapped[str | None] = mapped_column(String(100), nullable=True)


class StudyMembership(TimestampMixin, Base):
    __tablename__ = "study_memberships"
    __table_args__ = (UniqueConstraint("study_id", "user_id", "site_id", name="uq_membership_scope"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    study_id: Mapped[str] = mapped_column(ForeignKey("studies.id"), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    site_id: Mapped[str | None] = mapped_column(ForeignKey("sites.id"), nullable=True)
    role_in_study: Mapped[str] = mapped_column(String(30))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Site(TimestampMixin, Base):
    __tablename__ = "sites"
    __table_args__ = (UniqueConstraint("study_id", "site_code", name="uq_site_code_per_study"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    study_id: Mapped[str] = mapped_column(ForeignKey("studies.id"), index=True)
    site_code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(255))
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class MasterTerm(TimestampMixin, Base):
    __tablename__ = "master_terms"
    __table_args__ = (UniqueConstraint("category", "code", name="uq_master_term_category_code"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    category: Mapped[str] = mapped_column(String(50), index=True)
    code: Mapped[str] = mapped_column(String(40), index=True)
    label_en: Mapped[str] = mapped_column(String(160))
    label_hi: Mapped[str] = mapped_column(String(160))
    modern_mapping_en: Mapped[str | None] = mapped_column(String(255), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class Medicine(TimestampMixin, Base):
    __tablename__ = "medicines"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    medicine_code: Mapped[str] = mapped_column(String(40), unique=True)
    ayurveda_name: Mapped[str] = mapped_column(String(255))
    dosage_form_code: Mapped[str] = mapped_column(String(40))
    whodrug_code: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Protocol(TimestampMixin, Base):
    __tablename__ = "protocols"
    __table_args__ = (UniqueConstraint("study_id", "version", name="uq_protocol_version"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    study_id: Mapped[str] = mapped_column(ForeignKey("studies.id"), index=True)
    version: Mapped[str] = mapped_column(String(30))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    modern_diagnosis: Mapped[str] = mapped_column(String(255))
    vyadhi_code: Mapped[str] = mapped_column(String(40))
    intervention_name: Mapped[str] = mapped_column(String(255))
    medicine_id: Mapped[str | None] = mapped_column(ForeignKey("medicines.id"), nullable=True)
    dosage_form_code: Mapped[str] = mapped_column(String(40))
    anupana_code: Mapped[str] = mapped_column(String(40))
    treatment_duration_days: Mapped[int] = mapped_column(Integer)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)


class EthicsReview(TimestampMixin, Base):
    __tablename__ = "ethics_reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    study_id: Mapped[str] = mapped_column(ForeignKey("studies.id"), unique=True, index=True)
    iec_number: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30), default="PENDING")
    approval_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)


class Participant(TimestampMixin, Base):
    __tablename__ = "participants"
    __table_args__ = (
        UniqueConstraint("study_id", "participant_code", name="uq_participant_code_per_study"),
        UniqueConstraint("study_id", "randomization_id", name="uq_randomization_per_study"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    participant_code: Mapped[str] = mapped_column(String(50), index=True)
    study_id: Mapped[str] = mapped_column(ForeignKey("studies.id"), index=True)
    site_id: Mapped[str] = mapped_column(ForeignKey("sites.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    age: Mapped[int] = mapped_column(Integer)
    gender: Mapped[str] = mapped_column(String(30))
    modern_diagnosis: Mapped[str] = mapped_column(String(255))
    vyadhi_code: Mapped[str] = mapped_column(String(40))
    disease_duration_months: Mapped[int | None] = mapped_column(Integer, nullable=True)
    randomization_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    enrollment_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(30), default="SUBMITTED")
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"))


class AyurvedaBaseline(TimestampMixin, Base):
    __tablename__ = "ayurveda_baselines"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"), unique=True, index=True)
    prakriti_code: Mapped[str] = mapped_column(String(40))
    vikriti_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    agni_code: Mapped[str] = mapped_column(String(40))
    bala_code: Mapped[str] = mapped_column(String(40))
    satva_code: Mapped[str] = mapped_column(String(40))
    recorded_by: Mapped[str] = mapped_column(ForeignKey("users.id"))
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Visit(TimestampMixin, Base):
    __tablename__ = "visits"
    __table_args__ = (UniqueConstraint("participant_id", "visit_number", name="uq_visit_number_per_participant"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id"), index=True)
    visit_number: Mapped[int] = mapped_column(Integer)
    visit_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    scheduled_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    next_visit_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="SCHEDULED")
    investigator_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"))


class CRF(TimestampMixin, Base):
    __tablename__ = "crfs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    visit_id: Mapped[str] = mapped_column(ForeignKey("visits.id"), unique=True, index=True)
    systolic_bp: Mapped[int | None] = mapped_column(Integer, nullable=True)
    diastolic_bp: Mapped[int | None] = mapped_column(Integer, nullable=True)
    pulse_bpm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    temperature_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    agni_code: Mapped[str | None] = mapped_column(String(40), nullable=True)
    bala_code: Mapped[str | None] = mapped_column(String(40), nullable=True)
    symptoms: Mapped[str | None] = mapped_column(Text, nullable=True)
    medicine_id: Mapped[str | None] = mapped_column(ForeignKey("medicines.id"), nullable=True)
    dose: Mapped[str | None] = mapped_column(String(100), nullable=True)
    frequency: Mapped[str | None] = mapped_column(String(60), nullable=True)
    compliance: Mapped[str | None] = mapped_column(String(30), nullable=True)
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    completion_status: Mapped[str] = mapped_column(String(30), default="DRAFT")
    completed_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class DataQuery(TimestampMixin, Base):
    __tablename__ = "queries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    study_id: Mapped[str] = mapped_column(ForeignKey("studies.id"), index=True)
    target_type: Mapped[str] = mapped_column(String(30))
    target_id: Mapped[str] = mapped_column(String(36))
    field_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="OPEN")
    raised_by: Mapped[str] = mapped_column(ForeignKey("users.id"))
    raised_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    answered_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    answered_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    closed_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

