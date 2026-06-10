from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.db.base import Base
from app.models.chapter import Chapter, KnowledgePoint
from app.schemas.chapter import (
    ChapterCreate,
    ChapterOut,
    ChapterUpdate,
    KnowledgePointCreate,
    KnowledgePointOut,
    KnowledgePointUpdate,
)

router = APIRouter(prefix="/chapters", tags=["chapters"])


@router.get("/", response_model=List[ChapterOut])
def list_chapters(
    db: Annotated[Session, Depends(get_db)],
):
    chapters = db.query(Chapter).order_by(Chapter.sort_order).all()
    return chapters


@router.post("/", response_model=ChapterOut)
def create_chapter(
    chapter_in: ChapterCreate,
    db: Annotated[Session, Depends(get_db)],
):
    chapter = Chapter(**chapter_in.model_dump())
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


@router.put("/{chapter_id}", response_model=ChapterOut)
def update_chapter(
    chapter_id: int,
    chapter_in: ChapterUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    for field, value in chapter_in.model_dump(exclude_unset=True).items():
        setattr(chapter, field, value)
    db.commit()
    db.refresh(chapter)
    return chapter


@router.delete("/{chapter_id}")
def delete_chapter(
    chapter_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    db.delete(chapter)
    db.commit()
    return {"message": "Chapter deleted"}


# Knowledge Points

@router.post("/{chapter_id}/points", response_model=KnowledgePointOut)
def create_point(
    chapter_id: int,
    point_in: KnowledgePointCreate,
    db: Annotated[Session, Depends(get_db)],
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    point = KnowledgePoint(**point_in.model_dump(), chapter_id=chapter_id)
    db.add(point)
    db.commit()
    db.refresh(point)
    return point


@router.put("/points/{point_id}", response_model=KnowledgePointOut)
def update_point(
    point_id: int,
    point_in: KnowledgePointUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    point = db.query(KnowledgePoint).filter(KnowledgePoint.id == point_id).first()
    if not point:
        raise HTTPException(status_code=404, detail="Knowledge point not found")
    for field, value in point_in.model_dump(exclude_unset=True).items():
        setattr(point, field, value)
    db.commit()
    db.refresh(point)
    return point


@router.delete("/points/{point_id}")
def delete_point(
    point_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    point = db.query(KnowledgePoint).filter(KnowledgePoint.id == point_id).first()
    if not point:
        raise HTTPException(status_code=404, detail="Knowledge point not found")
    db.delete(point)
    db.commit()
    return {"message": "Knowledge point deleted"}
