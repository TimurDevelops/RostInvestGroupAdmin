import os
import uuid

# from fernet import Fernet

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "admin")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_DATABASE = os.getenv("DB_DATABASE", "rostinvestdb")

# FERNET_KEY = os.getenv("password_key", Fernet.generate_key())
FERNET_KEY = os.getenv("password_key", b"keT1fUb2LJqspx-fuusjO2-Xau0s8B1s1ZyT108NpoQ=")
JWT_KEY = os.getenv("jwt_key", str(uuid.uuid4()))

MIN_PASSWORD_LENGTH = 6
