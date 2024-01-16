import logging
from datetime import datetime

import jwt

from functools import wraps
from flask import request

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY, JWT_ALGORITHM
from backend.utils.errors import UserNotAuthorisedException, InsufficientPrivilegesException
from backend.utils.messages import (
    UNKNOWN_TOKEN_MESSAGE,
    TOKEN_EXPIRED_MESSAGE,
    REQUIRES_ADMIN_PRIVILEGE_MESSAGE,
    AUTH_ERROR_MESSAGE
)


def check_admin_privilege(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", None)
        if not token:
            raise UserNotAuthorisedException(message=UNKNOWN_TOKEN_MESSAGE)
        try:
            token = str.replace(str(token), "Bearer ", "")
            token_data = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALGORITHM])
            user_id = token_data.get("id")

            db = DBHandler()
            user = db.session.query(User).filter(User.id == user_id).first()
            if not user.is_admin:
                raise InsufficientPrivilegesException(message=REQUIRES_ADMIN_PRIVILEGE_MESSAGE)

        except InsufficientPrivilegesException as e:
            raise e
        except Exception as e:
            logging.warning(str(e))
            raise UserNotAuthorisedException(message=AUTH_ERROR_MESSAGE)

        return func(*args, **kwargs)

    return wrapper


def check_is_authorised(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", None)
        if not token:
            raise UserNotAuthorisedException(message=UNKNOWN_TOKEN_MESSAGE)
        try:
            token = str.replace(str(token), "Bearer ", "")
            token_data = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALGORITHM])
            expiration_date = datetime.fromtimestamp(token_data.get("exp"))
            if datetime.now() > expiration_date:
                raise UserNotAuthorisedException(message=TOKEN_EXPIRED_MESSAGE)

        except Exception as e:
            logging.warning(str(e))
            raise UserNotAuthorisedException(message=AUTH_ERROR_MESSAGE)
        return func(*args, **kwargs)

    return wrapper
