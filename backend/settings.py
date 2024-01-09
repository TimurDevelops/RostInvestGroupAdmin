import os
import uuid

from fernet import Fernet

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "admin")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_DATABASE = os.getenv("DB_DATABASE", "rostinvestdb")

FERNET_KEY = os.getenv("password_key", Fernet.generate_key())
JWT_KEY = os.getenv("jwt_key", uuid.uuid4())
