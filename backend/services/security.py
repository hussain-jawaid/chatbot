from passlib.context import CryptContext


# Create a CryptContext for bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


if __name__ == "__main__":
    password = "myPassword123"
    hashed_pass = hash_password(password)
    print("Orignal Password:", password)
    print("Hashed Password:", hashed_pass)


    print(verify_password(password, hashed_pass))
    print(verify_password("wrongpassword", hashed_pass))