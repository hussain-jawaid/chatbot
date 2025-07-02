from services.db import get_db_cursor


def create_chat_session(user_id: int) -> dict:
    """
    Create a new chat session for a user.
    Returns: { session_id: int, title: str | None }
    """
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO chat_sessions (user_id) VALUES (%s)", 
            (user_id, )
        )

        session_id = cursor.lastrowid
        return {
            "session_id": session_id,
            "title": None
        }

def update_session_title(session_id: int, title: str) -> None:
    """
    Update the title of a given session.
    Called after first user message is saved.
    """
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "UPDATE chat_sessions SET title = %s WHERE id = %s",
            (title, session_id, )
        )

def get_user_sessions(user_id: int) -> list[dict]:
    """
    Return a list of sessions for the user.
    Each item: { session_id, title, started_at }
    """
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            SELECT id AS session_id, title, started_at
            FROM chat_sessions
            WHERE user_id = %s
            ORDER BY started_at DESC
            """,
            (user_id, )
        )
        return cursor.fetchall()

def get_last_user_session(user_id: int) -> dict | None:
    """
    Return the most recent session for a user.
    Useful to continue chat if session is active.
    Returns: { session_id, title, started_at } or None
    """
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            SELECT id AS session_id, title, started_at
            FROM chat_sessions
            WHERE user_id = %s
            ORDER BY started_at DESC
            LIMIT 1
            """,
            (user_id,)
        )
        return cursor.fetchone()


def save_message(session_id: int, sender: str, content: str) -> None:
    """
    Save a message in a session (user or bot).
    """
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            INSERT INTO messages (session_id, sender, content)
            VALUES (%s, %s, %s)
            """,
            (session_id, sender, content)
        )


def get_session_messages(session_id: int) -> list[dict]:
    """
    Return all messages for a session.
    Each: { sender, content, timestamp }
    """
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            SELECT sender, content, timestamp
            FROM messages
            WHERE session_id = %s
            ORDER BY timestamp ASC
            """,
            (session_id,)
        )
        return cursor.fetchall()


def delete_session_by_id(session_id: int): 
    """
    Delete a session by session_id.
    """
    with get_db_cursor(commit=True) as cursor:
        cursor.execute("DELETE FROM chat_sessions WHERE id = %s", (session_id, ))
        return {"message": "Session deleted successfully."}


delete_session_by_id(3)