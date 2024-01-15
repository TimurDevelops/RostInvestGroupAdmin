from sqlalchemy import Integer, String, LargeBinary, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String, nullable=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    password: Mapped[str] = mapped_column(LargeBinary, nullable=False)

    @classmethod
    def as_dict(cls, user):
        d_user = {}
        for column in cls.__table__.columns:
            if getattr(user, column.key, None):
                d_user[column.key] = user.__getattribute__(column.key)

        return d_user
