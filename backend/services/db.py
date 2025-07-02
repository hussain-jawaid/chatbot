import mysql.connector
from contextlib import contextmanager


@contextmanager
def get_db_cursor(commit=False):
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="chatbot_db"
    )
    cursor = connection.cursor(dictionary=True)
    
    try:
        yield cursor
        if commit:
            connection.commit()
    except Exception as e:
        print("Error occured during connecting to the database:", e)
    finally:
        cursor.close()
        connection.close()