from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.role import Role

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("/")
def list_roles(
    db: Annotated[Session, Depends(get_db)]
) -> List[dict]:
    roles = db.query(Role).all()
    return [
        {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "permissions": role.permissions
        }
        for role in roles
    ]
