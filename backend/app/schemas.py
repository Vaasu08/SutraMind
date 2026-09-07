from datetime import date
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


Role = Literal["ADMIN", "PI", "COORDINATOR", "MONITOR", "ETHICS", "PV"]


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=200)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Invalid email address format")
        return value


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=200)
    role: Role

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Invalid email address format")
        return value


class MasterTermCreate(BaseModel):
    category: str = Field(min_length=2, max_length=50)
    code: str = Field(min_length=1, max_length=40)
    label_en: str = Field(min_length=1, max_length=160)
    label_hi: str = Field(min_length=1, max_length=160)
    modern_mapping_en: str | None = Field(default=None, max_length=255)
    active: bool = True
    sort_order: int = 0

    @field_validator("category", "code")
    @classmethod
    def normalized_codes(cls, value: str) -> str:
        return value.strip().upper()


class MasterTermUpdate(BaseModel):
    label_en: str | None = Field(default=None, min_length=1, max_length=160)
    label_hi: str | None = Field(default=None, min_length=1, max_length=160)
    modern_mapping_en: str | None = Field(default=None, max_length=255)
    active: bool | None = None
    sort_order: int | None = None


class SiteInput(BaseModel):
    site_code: str = Field(min_length=2, max_length=40)
    name: str = Field(min_length=2, max_length=255)
    address: str | None = Field(default=None, max_length=2000)


class MembershipInput(BaseModel):
    user_id: str
    site_code: str | None = None
    role_in_study: Role


class ProtocolInput(BaseModel):
    version: str = Field(default="1.0", min_length=1, max_length=30)
    modern_diagnosis: str = Field(min_length=2, max_length=255)
    vyadhi_code: str = Field(min_length=1, max_length=40)
    intervention_name: str = Field(min_length=2, max_length=255)
    medicine_id: str | None = None
    dosage_form_code: str = Field(min_length=1, max_length=40)
    anupana_code: str = Field(min_length=1, max_length=40)
    treatment_duration_days: int = Field(ge=1, le=3650)
    summary: str | None = Field(default=None, max_length=4000)


class EthicsInput(BaseModel):
    iec_number: str = Field(min_length=2, max_length=100)
    status: Literal["PENDING", "SUBMITTED", "APPROVED", "REJECTED", "EXPIRED"] = "PENDING"
    approval_date: date | None = None
    expiry_date: date | None = None
    remarks: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def valid_date_range(self) -> "EthicsInput":
        if self.approval_date and self.expiry_date and self.expiry_date < self.approval_date:
            raise ValueError("Expiry date cannot be before approval date")
        return self


class StudyCreate(BaseModel):
    study_code: str = Field(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9-]+$")
    title: str = Field(min_length=5, max_length=500)
    short_title: str | None = Field(default=None, max_length=180)
    pi_id: str | None = None
    institution: str = Field(min_length=2, max_length=255)
    trial_phase: str | None = Field(default=None, max_length=80)
    sample_size: int = Field(ge=1, le=100000)
    start_date: date
    end_date: date
    ctri_number: str | None = Field(default=None, max_length=100)
    protocol: ProtocolInput
    ethics: EthicsInput
    sites: list[SiteInput] = Field(min_length=1, max_length=20)
    memberships: list[MembershipInput] = Field(default_factory=list)

    @field_validator("study_code")
    @classmethod
    def normalized_study_code(cls, value: str) -> str:
        return value.strip().upper()

    @model_validator(mode="after")
    def valid_study_dates(self) -> "StudyCreate":
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be before start date")
        return self


class StudyUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=5, max_length=500)
    short_title: str | None = Field(default=None, max_length=180)
    institution: str | None = Field(default=None, min_length=2, max_length=255)
    trial_phase: str | None = Field(default=None, max_length=80)
    sample_size: int | None = Field(default=None, ge=1, le=100000)
    start_date: date | None = None
    end_date: date | None = None
    status: Literal["DRAFT", "ACTIVE", "CLOSED"] | None = None


class BaselineInput(BaseModel):
    prakriti_code: str = Field(min_length=1, max_length=40)
    vikriti_notes: str | None = Field(default=None, max_length=2000)
    agni_code: str = Field(min_length=1, max_length=40)
    bala_code: str = Field(min_length=1, max_length=40)
    satva_code: str = Field(min_length=1, max_length=40)


class ParticipantCreate(BaseModel):
    participant_code: str = Field(min_length=2, max_length=50)
    study_id: str
    site_id: str
    name: str = Field(min_length=2, max_length=255)
    age: int = Field(ge=0, le=120)
    gender: Literal["FEMALE", "MALE", "OTHER", "PREFER_NOT_TO_SAY"]
    modern_diagnosis: str = Field(min_length=2, max_length=255)
    vyadhi_code: str = Field(min_length=1, max_length=40)
    disease_duration_months: int | None = Field(default=None, ge=0, le=1440)
    randomization_id: str | None = Field(default=None, max_length=80)
    enrollment_date: date
    baseline: BaselineInput

    @field_validator("participant_code")
    @classmethod
    def normalized_participant_code(cls, value: str) -> str:
        return value.strip().upper()


class ParticipantUpdate(BaseModel):
    status: Literal["DRAFT", "SUBMITTED", "ENROLLED", "COMPLETED", "WITHDRAWN"] | None = None
    name: str | None = Field(default=None, min_length=2, max_length=255)
    disease_duration_months: int | None = Field(default=None, ge=0, le=1440)


class VisitCreate(BaseModel):
    participant_id: str
    visit_number: int = Field(ge=0, le=999)
    scheduled_date: date
    investigator_id: str | None = None


class VisitUpdate(BaseModel):
    scheduled_date: date | None = None
    next_visit_date: date | None = None
    status: Literal["SCHEDULED", "MISSED"] | None = None
    investigator_id: str | None = None


class CRFInput(BaseModel):
    visit_id: str
    visit_date: date | None = None
    investigator_id: str | None = None
    systolic_bp: int | None = Field(default=None, ge=20, le=300)
    diastolic_bp: int | None = Field(default=None, ge=10, le=250)
    pulse_bpm: int | None = Field(default=None, ge=10, le=300)
    weight_kg: float | None = Field(default=None, ge=1, le=500)
    temperature_c: float | None = Field(default=None, ge=25, le=50)
    agni_code: str | None = Field(default=None, max_length=40)
    bala_code: str | None = Field(default=None, max_length=40)
    symptoms: str | None = Field(default=None, max_length=2000)
    medicine_id: str | None = None
    dose: str | None = Field(default=None, max_length=100)
    frequency: str | None = Field(default=None, max_length=60)
    compliance: Literal["YES", "NO", "PARTIAL"] | None = None
    remarks: str | None = Field(default=None, max_length=2000)
    completion_status: Literal["DRAFT", "COMPLETED"] = "DRAFT"

    @model_validator(mode="after")
    def validate_blood_pressure(self) -> "CRFInput":
        if self.systolic_bp and self.diastolic_bp and self.diastolic_bp >= self.systolic_bp:
            raise ValueError("Diastolic BP must be lower than systolic BP")
        return self


class QueryCreate(BaseModel):
    study_id: str
    target_type: Literal["PARTICIPANT", "BASELINE", "VISIT", "CRF"]
    target_id: str
    field_name: str | None = Field(default=None, max_length=100)
    message: str = Field(min_length=5, max_length=2000)


class QueryUpdate(BaseModel):
    action: Literal["ANSWER", "CLOSE"]
    answer: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def answer_is_required(self) -> "QueryUpdate":
        if self.action == "ANSWER" and not self.answer:
            raise ValueError("An answer is required")
        return self

