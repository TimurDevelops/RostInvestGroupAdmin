import datetime

from sqlalchemy import Integer, String, LargeBinary, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass

    @classmethod
    def as_dict(cls, user):
        d_user = {}
        for column in cls.__table__.columns:
            if getattr(user, column.key, None):
                if isinstance(user.__getattribute__(column.key), datetime.datetime):
                    date = user.__getattribute__(column.key)
                    d_user[column.key] = datetime.datetime.strftime(date, "%Y/%m/%d %H:%M:%S")
                else:
                    d_user[column.key] = user.__getattribute__(column.key)

        return d_user


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String, nullable=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    password: Mapped[str] = mapped_column(LargeBinary, nullable=False)
    create_date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    update_date: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        onupdate=func.current_timestamp()
    )


class Category(Base):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=True)
    parent_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("category"))
    category_image: Mapped[str] = mapped_column(String, nullable=True)
    create_date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    update_date: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        onupdate=func.current_timestamp()
    )


class Product(Base):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(String, nullable=True)
    parent_category_id: Mapped[int] = mapped_column(Integer, ForeignKey("category"))
    product_image: Mapped[str] = mapped_column(String, nullable=True)
    product_price: Mapped[str] = mapped_column(String, nullable=True)
    create_date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    update_date: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        onupdate=func.current_timestamp()
    )
