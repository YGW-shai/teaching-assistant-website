from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    PROJECT_NAME: str = "教学辅助网站"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "面向高校的编程课程教学辅助平台"

    DATABASE_URL: str = "sqlite:///./teaching_platform.db"

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
