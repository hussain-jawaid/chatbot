from pydantic import BaseModel, EmailStr


class SignUpUser(BaseModel):
    username: str
    email: EmailStr
    password: str


class LogInUser(BaseModel):
    email: EmailStr
    password: str