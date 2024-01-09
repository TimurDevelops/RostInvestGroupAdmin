import os
from cryptography.fernet import Fernet

key = os.getenv("password_key", Fernet.generate_key())


def encrypt(text: str):
    fernet = Fernet(key)
    encrypted_text = fernet.encrypt(text.encode())
    return encrypted_text
