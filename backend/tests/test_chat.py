import pytest
import random
import string
from crud import chat_db
from crud.auth import register_user
from services.db import get_db_cursor
import time


def random_email():
    return f"test_{''.join(random.choices(string.ascii_lowercase, k=6))}@mail.com"


@pytest.fixture
def test_user():
    username = "test_chat_user"
    email = random_email()
    password = "testpass123"
    user_id = None

    # Register user and get user_id
    register_user(username, email, password)
    with get_db_cursor() as cursor:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()["id"]

    yield {"id": user_id, "email": email}

    # Cleanup
    with get_db_cursor(commit=True) as cursor:
        cursor.execute("DELETE FROM messages WHERE session_id IN (SELECT id FROM chat_sessions WHERE user_id = %s)", (user_id,))
        cursor.execute("DELETE FROM chat_sessions WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))


def test_create_chat_session(test_user):
    session = chat_db.create_chat_session(test_user["id"])
    assert session["session_id"] is not None
    assert session["title"] is None


def test_save_and_get_messages(test_user):
    session = chat_db.create_chat_session(test_user["id"])
    session_id = session["session_id"]

    chat_db.save_message(session_id, "user", "Hello")
    chat_db.save_message(session_id, "bot", "Hi there!")

    messages = chat_db.get_session_messages(session_id)
    assert len(messages) == 2
    assert messages[0]["sender"] == "user"
    assert messages[1]["sender"] == "bot"


def test_update_and_get_session_title(test_user):
    session = chat_db.create_chat_session(test_user["id"])
    session_id = session["session_id"]

    title = "Fix my Python bug"
    chat_db.update_session_title(session_id, title)

    sessions = chat_db.get_user_sessions(test_user["id"])
    assert sessions[0]["title"] == title


def test_get_last_user_session(test_user):
    session1 = chat_db.create_chat_session(test_user["id"])
    time.sleep(1)
    session2 = chat_db.create_chat_session(test_user["id"])

    last = chat_db.get_last_user_session(test_user["id"])
    assert last["session_id"] == session2["session_id"]
