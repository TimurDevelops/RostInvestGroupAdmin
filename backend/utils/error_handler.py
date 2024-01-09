import logging
from functools import wraps
from flask import jsonify

from backend.utils.errors import LoginException
from backend.utils.messages import UNEXPECTED_ERROR_MESSAGE


def error_handler(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except LoginException as e:
            logging.warning(str(e))
            return jsonify({"errors": [str(e)]}), 409

        except Exception as e:
            logging.warning(str(e))
            return jsonify({"errors": [UNEXPECTED_ERROR_MESSAGE]}), 500

    return wrapper
