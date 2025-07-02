from services.db import get_db_cursor
from services.security import hash_password, verify_password


def login_user(email: str, password: str):
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT id, username, email, password_hash FROM users WHERE email = %s LIMIT 1",
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            return {"error": "User not found!"}
        
        if not verify_password(password, user["password_hash"]):
            return {"error": "Invalid password!"}
        
        user.pop("password_hash")
        return {"message": "Login successful", "user": user}

def register_user(username: str, email: str, password: str):
    hashed_password = hash_password(password)

    with get_db_cursor(commit=True) as cursor:
        # Check if user exists by email
        cursor.execute("SELECT 1 FROM users WHERE email = %s LIMIT 1", (email,))
        if cursor.fetchone():
            return {"error": "This user already exists!"}
        
        # Insert new user
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )
        
        return {"message": f"New user registered with email: {email}"}


if __name__ == "__main__":
    # Test data
    username = "hussain"
    email = "hussain@example.com"
    password = "securePassword123"

    # Register
    print("Registering user...")
    reg_result = register_user(username, email, password)
    print(reg_result)

    # Login (correct password)
    print("\nLogging in with correct password...")
    login_result = login_user(email, password)
    print(login_result)

    # Login (wrong password)
    print("\nLogging in with wrong password...")
    wrong_login_result = login_user(email, "wrongpass")
    print(wrong_login_result)