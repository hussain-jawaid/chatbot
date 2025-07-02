from fastapi import APIRouter, HTTPException, Depends
from crud.auth import login_user, register_user
from schemas.auth import SignUpUser, LogInUser
from services.token_service import verify_token, create_access_token


router = APIRouter()

@router.post("/signup")
def signup(data: SignUpUser):
    result = register_user(data.username, data.email, data.password)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/login")
def login(data: LogInUser):
    result = login_user(data.email, data.password)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    user = result["user"]
    token = create_access_token({
        "user_id": user["id"],
        "username": user["username"]
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "user": user
    }


@router.get("/me")
def get_current_user(data: dict = Depends(verify_token)):
    return {
        "user_id": data["user_id"],
        "username": data["username"]
    }