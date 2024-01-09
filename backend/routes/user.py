import jwt
from flask import Blueprint, request, jsonify

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY, MIN_PASSWORD_LENGTH
from backend.utils.cipher import encrypt
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, USER_EXISTS_MESSAGE, PASSWORD_TOO_SHORT_MESSAGE

auth_blueprint = Blueprint('user', __name__)


@auth_blueprint.route('/', methods=["POST"])
@error_handler
def create_user():
    """
    Create a new user.
    """
    username = request.json["username"]
    password = request.json["password"]
    if not username or not password:
        raise InvalidFieldsException(message=MISSING_LOGIN_PASSWORD_MESSAGE)
    db = DBHandler()
    user = db.session.query(User).filter(User.username == username).first()
    if user:
        raise InvalidFieldsException(message=USER_EXISTS_MESSAGE)
    if MIN_PASSWORD_LENGTH < password:
        raise InvalidFieldsException(message=PASSWORD_TOO_SHORT_MESSAGE)

    password_hash = encrypt(password)
    db = DBHandler()
    db.session.add(User(username=username, password=password_hash))
    db.session.commit()

    encoded_jwt = jwt.encode({"user_id": user.id}, JWT_KEY, algorithm="HS256")
    return jsonify({"token": encoded_jwt}), 200
