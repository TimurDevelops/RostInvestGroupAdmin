import jwt
from flask import Blueprint, request, jsonify
from sqlalchemy import Row

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY, MIN_PASSWORD_LENGTH
from backend.utils.cipher import encrypt
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, USER_EXISTS_MESSAGE, PASSWORD_TOO_SHORT_MESSAGE

users_blueprint = Blueprint('user', __name__)


@users_blueprint.route('/', methods=["POST"])
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
    if len(password) < MIN_PASSWORD_LENGTH:
        raise InvalidFieldsException(message=PASSWORD_TOO_SHORT_MESSAGE)

    password_hash = encrypt(password)
    db.session.add(User(username=username, password=password_hash))
    db.session.commit()

    user = db.session.query(User).filter(User.username == username).first()
    encoded_jwt = jwt.encode({"username": user.username, "id": user.id}, JWT_KEY, algorithm="HS256")
    return jsonify({"token": encoded_jwt}), 200


@users_blueprint.route('/get-users', methods=["POST"])
@error_handler
def get_users():
    """
    Get all users.
    """
    db = DBHandler()
    users = db.session.query(User).with_entities(User.id, User.username).all()
    return {"users": [User.as_dict(user) for user in users]}, 200
