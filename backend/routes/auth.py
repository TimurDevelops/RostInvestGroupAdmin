import jwt

from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY, JWT_ALGORITHM
from backend.utils.cipher import decrypt
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, WRONG_LOGIN_PASSWORD_MESSAGE

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('', methods=["POST"])
@error_handler
def authenticate_user():
    """
    Authenticate existing user.
    """
    username = request.json["username"]
    password = request.json["password"]
    if not username or not password:
        raise InvalidFieldsException(message=MISSING_LOGIN_PASSWORD_MESSAGE)
    db = DBHandler()
    user = db.session.query(User).filter(User.username == username).first()
    if not user:
        raise InvalidFieldsException(message=WRONG_LOGIN_PASSWORD_MESSAGE)
    if password != decrypt(user.password):
        raise InvalidFieldsException(message=WRONG_LOGIN_PASSWORD_MESSAGE)

    expiration_date = datetime.now() + timedelta(hours=5)
    encoded_jwt = jwt.encode(
        {"username": user.username, "id": user.id, "exp": expiration_date},
        JWT_KEY,
        algorithm=JWT_ALGORITHM
    )
    return jsonify({"success": True, "user": user.username, "token": encoded_jwt, "id": user.id}), 200
