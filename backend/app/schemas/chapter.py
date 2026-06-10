from pydantic import BaseModel
from typing import List


class KnowledgePointBase(BaseModel):
    key: str
    title: str
    content: str = ""
    guide: str = ""
    default_code: str = ""
    sort_order: int = 0


class KnowledgePointCreate(KnowledgePointBase):
    pass


class KnowledgePointUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    guide: str | None = None
    default_code: str | None = None
    sort_order: int | None = None


class KnowledgePointOut(KnowledgePointBase):
    id: int
    chapter_id: int

    class Config:
        from_attributes = True


class ChapterBase(BaseModel):
    key: str
    title: str
    sort_order: int = 0


class ChapterCreate(ChapterBase):
    pass


class ChapterUpdate(BaseModel):
    title: str | None = None
    sort_order: int | None = None


class ChapterOut(ChapterBase):
    id: int
    knowledge_points: List[KnowledgePointOut] = []

    class Config:
        from_attributes = True
