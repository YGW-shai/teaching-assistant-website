from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserOut])
def list_users(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_role("admin"))],
    skip: int = 0,
    limit: int = 100
):
    return db.query(User).offset(skip).limit(limit).all()


@router.get("/me", response_model=UserOut)
def get_current_user_info(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user
