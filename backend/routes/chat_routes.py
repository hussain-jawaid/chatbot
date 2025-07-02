from fastapi import APIRouter, Depends, HTTPException
from crud.chat_db import (
    create_chat_session,
    update_session_title,
    get_user_sessions,
    get_last_user_session,
    save_message,
    get_session_messages,
    delete_session_by_id
)
from schemas.chat import UpdateSessionTitle, SaveMessage, DeleteSession
from services.token_service import verify_token
from services.groq_bot import get_bot_response

router = APIRouter()

@router.post("/create-session")
def create_new_session(user_data: dict = Depends(verify_token)):
    session = create_chat_session(user_data["user_id"])
    return {
        "message": "New session created",
        "session": session
    }

@router.post("/update-title")
def update_title(data: UpdateSessionTitle, user_data: dict = Depends(verify_token)):
    # Optional: Add ownership validation if needed
    update_session_title(data.session_id, data.title)
    return {"message": "Title updated successfully"}

@router.get("/sessions")
def fetch_user_sessions(user_data: dict = Depends(verify_token)):
    sessions = get_user_sessions(user_data["user_id"])
    return {
        "message": "User sessions retrieved",
        "sessions": sessions
    }

@router.get("/last-session")
def fetch_last_session(user_data: dict = Depends(verify_token)):
    session = get_last_user_session(user_data["user_id"])
    return {
        "message": "Last session fetched",
        "session": session
    }

@router.post("/save-message")
def save_chat_message(data: SaveMessage, user_data: dict = Depends(verify_token)):
    save_message(data.session_id, data.sender, data.content)
    return {"message": "Message saved successfully"}

@router.get("/messages/{session_id}")
def fetch_messages(session_id: int, user_data: dict = Depends(verify_token)):
    # Stronger security: check ownership
    user_sessions = get_user_sessions(user_data["user_id"])
    if not any(session["session_id"] == session_id for session in user_sessions):
        raise HTTPException(status_code=403, detail="Unauthorized to view this session")

    messages = get_session_messages(session_id)
    return {
        "message": "Messages fetched successfully",
        "messages": messages
    }

@router.post("/respond")
def respond_to_message(data: dict):
    history = data["messages"]
    response = get_bot_response(history)
    return {"response": response}


@router.post("/delete-session")
def delete_session(data: DeleteSession):
    response = delete_session_by_id(data.session_id)
    return {"message": response["message"]}