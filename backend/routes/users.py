from datetime import datetime

import jwt
from flask import Blueprint, request, jsonify

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY, MIN_PASSWORD_LENGTH, JWT_ALGORITHM
from backend.utils.cipher import encrypt
from backend.utils.decorators import check_admin_privilege, check_is_authorised
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, USER_EXISTS_MESSAGE, PASSWORD_TOO_SHORT_MESSAGE

users_blueprint = Blueprint('user', __name__)


def create_user():
    username = request.json["username"]
    password = request.json["password"]
    name = request.json["name"]
    email = request.json["email"]
    is_admin = request.json["isAdmin"]

    if not username or not password:
        raise InvalidFieldsException(message=MISSING_LOGIN_PASSWORD_MESSAGE)
    if len(password) < MIN_PASSWORD_LENGTH:
        raise InvalidFieldsException(message=PASSWORD_TOO_SHORT_MESSAGE)

    db = DBHandler()
    user = db.session.query(User).filter(User.username == username).first()
    if user:
        raise InvalidFieldsException(message=USER_EXISTS_MESSAGE)
    password_hash = encrypt(password)
    db.session.add(User(username=username, password=password_hash, name=name, email=email, is_admin=is_admin))
    db.session.commit()

    return jsonify({"success": True}), 201


@users_blueprint.route('/create_default', methods=["POST"])
@error_handler
def create_default_user():
    """
    Create a default user.
    """
    return create_user()


@users_blueprint.route('', methods=["POST"])
@error_handler
@check_admin_privilege
@check_is_authorised
def create_new_user():
    """
    Create a new user.
    """
    create_user()
    return {"success": True}, 201


@users_blueprint.route('/get-users', methods=["POST"])
@error_handler
def get_users():
    """
    Get all users.
    """
    db = DBHandler()
    users = db.session.query(User).with_entities(
        User.id,
        User.username,
        User.name,
        User.email,
        User.is_admin,
        User.create_date,
        User.update_date
    ).all()

    return {"users": [User.as_dict(user) for user in users]}, 200
