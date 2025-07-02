import pytest
import random
import string
from crud.auth import register_user, login_user
from services.db import get_db_cursor


def random_email():
    return f"test_{''.join(random.choices(string.ascii_lowercase, k=6))}@mail.com"


@pytest.fixture
def test_user():
    username = "testuser"
    email = random_email()
    password = "testpass123"

    try:
        register_user(username, email, password)        
        yield {"username": username, "email": email, "password": password}
    except Exception as e:
        print("An error occurred during test setup:", e)
    finally:
        with get_db_cursor(commit=True) as cursor:
            cursor.execute("DELETE FROM users WHERE email = %s", (email,))


def test_login_user(test_user):
    result = login_user(test_user["email"], test_user["password"])

    assert "user" in result
    assert result["user"]["username"] == test_user["username"]
    assert result["user"]["email"] == test_user["email"]


def test_login_with_wrong_password(test_user):
    result = login_user(test_user["email"], "wrongpassword")

    assert "error" in result
    assert result["error"] == "Invalid password!"


def test_login_with_nonexistent_email():
    result = login_user("nonexistent@example.com", "anyPassword")

    assert "error" in result
    assert result["error"] == "User not found!"


def test_register_duplicate_user(test_user):
    duplicate_result = register_user(test_user["username"], test_user["email"], test_user["password"])

    assert "error" in duplicate_result
    assert duplicate_result["error"] == "This user already exists!"
