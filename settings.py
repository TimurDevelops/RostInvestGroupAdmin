import os

DB_USER = os.getenv("", "postgress")
DB_PASS = os.getenv("", "admin")
DB_HOST = os.getenv("", "127.0.0.1")
DB_PORT = os.getenv("", "5432")
DB_DATABASE = os.getenv("", "rostinvestdb")
