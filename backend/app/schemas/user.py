from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True