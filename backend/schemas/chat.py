from pydantic import BaseModel
from typing import List


class UpdateSessionTitle(BaseModel):
    session_id: int
    title: str


class SaveMessage(BaseModel):
    session_id: int
    sender: str
    content: str


class DeleteSession(BaseModel):
    session_id: int