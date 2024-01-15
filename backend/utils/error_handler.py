import logging
from functools import wraps
from flask import jsonify

from backend.utils.errors import InvalidFieldsException, UserNotAuthorisedException, InsufficientPrivilegesException
from backend.utils.messages import UNEXPECTED_ERROR_MESSAGE


def error_handler(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except InvalidFieldsException as e:
            logging.warning(f"Exception: {str(e)}")
            return jsonify({"errors": [str(e)]}), 406

        except UserNotAuthorisedException as e:
            logging.warning(f"Exception: {str(e)}")
            return jsonify({"errors": [str(e)]}), 401

        except InsufficientPrivilegesException as e:
            logging.warning(f"Exception: {str(e)}")
            return jsonify({"errors": [str(e)]}), 403

        except Exception as e:
            logging.warning(str(e))
            return jsonify({"errors": [UNEXPECTED_ERROR_MESSAGE]}), 500

    return wrapper
