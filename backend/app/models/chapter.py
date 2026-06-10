from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    sort_order = Column(Integer, default=0)

    knowledge_points = relationship("KnowledgePoint", back_populates="chapter", cascade="all, delete-orphan")

class KnowledgePoint(Base):
    __tablename__ = "knowledge_points"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, default="")
    guide = Column(Text, default="")
    default_code = Column(Text, default="")
    sort_order = Column(Integer, default=0)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)

    chapter = relationship("Chapter", back_populates="knowledge_points")
