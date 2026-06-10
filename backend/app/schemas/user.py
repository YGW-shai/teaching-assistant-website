from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    student_id: str
    full_name: str | None = None


class UserCreate(UserBase):
    password: str
    role_name: str = "student"


class UserOut(BaseModel):
    id: int
    student_id: str | None = None
    username: str | None = None
    full_name: str | None = None
    is_active: bool
    role_id: int
    role_name: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    student_id: str
    password: str
