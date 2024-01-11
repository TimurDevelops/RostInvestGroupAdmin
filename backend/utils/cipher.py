from cryptography.fernet import Fernet

from backend.settings import FERNET_KEY


def encrypt(text: str):
    fernet = Fernet(FERNET_KEY)
    encrypted_text = fernet.encrypt(text.encode())
    return encrypted_text


def decrypt(text: bytes):
    fernet = Fernet(FERNET_KEY)
    decrypted_text = fernet.decrypt(text.decode()).decode()
    return decrypted_text
