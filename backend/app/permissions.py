from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Site, Study, StudyMembership, User


PERMISSIONS: dict[str, set[str]] = {
    "ADMIN": {"*"},
    "PI": {
        "study:create", "study:edit", "study:read", "participant:read", "participant:approve",
        "visit:read", "crf:read", "query:read", "query:answer", "query:close", "ethics:read",
        "dashboard:read", "master:read",
    },
    "COORDINATOR": {
        "study:read", "participant:read", "participant:create", "participant:edit", "visit:read",
        "visit:create", "visit:edit", "crf:read", "crf:write", "query:read", "query:answer",
        "dashboard:read", "master:read",
    },
    "MONITOR": {"study:read", "participant:read", "visit:read", "crf:read", "query:read", "query:raise", "dashboard:read", "master:read"},
    "ETHICS": {"study:read", "ethics:read", "ethics:write"},
    "PV": {"study:read", "ethics:read", "dashboard:read"},
}


def require_permission(user: User, permission: str) -> None:
    allowed = PERMISSIONS.get(user.role, set())
    if "*" not in allowed and permission not in allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission for this action")


def accessible_study_ids(db: Session, user: User) -> set[str]:
    if user.role == "ADMIN":
        return set(db.scalars(select(Study.id)).all())
    ids = set(db.scalars(select(Study.id).where(Study.pi_id == user.id)).all())
    ids.update(
        db.scalars(
            select(StudyMembership.study_id).where(
                StudyMembership.user_id == user.id,
                StudyMembership.is_active.is_(True),
            )
        ).all()
    )
    return ids


def require_study_access(db: Session, user: User, study_id: str, site_id: str | None = None) -> Study:
    study = db.get(Study, study_id)
    if not study or study_id not in accessible_study_ids(db, user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study not found")
    if user.role == "COORDINATOR" and site_id:
        membership = db.scalar(
            select(StudyMembership).where(
                StudyMembership.study_id == study_id,
                StudyMembership.user_id == user.id,
                StudyMembership.site_id == site_id,
                StudyMembership.is_active.is_(True),
            )
        )
        if not membership:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not assigned to this study site")
    return study


def require_site_belongs_to_study(db: Session, study_id: str, site_id: str) -> Site:
    site = db.get(Site, site_id)
    if not site or site.study_id != study_id or not site.is_active:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Selected site does not belong to this study")
    return site

