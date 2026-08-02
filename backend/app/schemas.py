# Purpose: Defines Pydantic schemas for validating API request and response payloads.

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class VehicleCreate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleOut(VehicleCreate):
    id: int

    class Config:
        from_attributes = True
