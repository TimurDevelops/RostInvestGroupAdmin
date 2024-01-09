from sqlalchemy.orm import sessionmaker

from backend import settings as s

from backend.models.models import Base
from sqlalchemy import create_engine


class DBHandler:

    def __init__(self):
        self.CONNECTION_URL = f"postgresql+psycopg2://{s.DB_USER}:{s.DB_PASS}@{s.DB_HOST}:{s.DB_PORT}/{s.DB_DATABASE}"
        self.engine = create_engine(self.CONNECTION_URL, echo=True)
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()
