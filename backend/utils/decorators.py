import logging
from datetime import datetime

import jwt

from functools import wraps
from flask import request

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY, JWT_ALGORITHM
from backend.utils.errors import UserNotAuthorisedException
from backend.utils.messages import USER_NOT_AUTHORISED_MESSAGE, UNKNOWN_TOKEN_MESSAGE, REQUIRES_ADMIN_PRIVILEGE_MESSAGE


def check_admin_privilege(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", None)
        if not token:
            raise UserNotAuthorisedException(message=USER_NOT_AUTHORISED_MESSAGE)
        try:
            token = str.replace(str(token), "Bearer ", "")
            token_data = jwt.decode(token, JWT_KEY, algorithm="HS256")
            user_id = token_data.get("id")

            db = DBHandler()
            user = db.session.query(User).filter(User.id == user_id).first()
            if not user.is_admin:
                raise UserNotAuthorisedException(message=REQUIRES_ADMIN_PRIVILEGE_MESSAGE)

            return func(*args, **kwargs)

        except Exception as e:
            logging.warning(str(e))
            raise UserNotAuthorisedException(message=UNKNOWN_TOKEN_MESSAGE)

    return wrapper


def check_is_authorised(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", None)
        if not token:
            raise UserNotAuthorisedException(message=USER_NOT_AUTHORISED_MESSAGE)
        try:
            token = str.replace(str(token), "Bearer ", "")
            token_data = jwt.decode(token, JWT_KEY, algorithm=JWT_ALGORITHM)
            if not token_data.get("id") or not token_data.get("username") or not token_data.get("exp"):
                raise UserNotAuthorisedException(message=UNKNOWN_TOKEN_MESSAGE)
            if datetime.now() > token_data.get("exp"):
                raise UserNotAuthorisedException(message=USER_NOT_AUTHORISED_MESSAGE)

            return func(*args, **kwargs)

        except Exception as e:
            logging.warning(str(e))
            raise UserNotAuthorisedException(message=UNKNOWN_TOKEN_MESSAGE)

    return wrapper
