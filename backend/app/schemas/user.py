from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None


class UserCreate(UserBase):
    password: str
    role_name: str = "student"


class UserOut(UserBase):
    id: int
    is_active: bool
    role_id: int
    role_name: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str
