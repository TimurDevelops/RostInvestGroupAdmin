from sqlalchemy.orm import sessionmaker

import settings as s

from functools import wraps
from models.models import Base
from sqlalchemy import create_engine


def error_handler(func):

    @wraps
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            raise e
    return wrapper


class DBHandler:

    def __init__(self):
        self.CONNECTION_URL = f"postgressql+psycopg2://{s.DB_USER}:{s.DB_PASS}@{s.DB_HOST}:{s.DB_PORT}/{s.DB_DATABASE}"
        self.engine = create_engine(self.CONNECTION_URL, echo=True)
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()
