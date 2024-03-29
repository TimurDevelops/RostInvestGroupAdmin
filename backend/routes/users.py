import jwt
from flask import Blueprint, request, jsonify

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import MIN_PASSWORD_LENGTH, JWT_ALGORITHM, JWT_KEY
from backend.utils.cipher import encrypt
from backend.utils.decorators import check_admin_privilege, check_is_authorised
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException, UserNotAuthorisedException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, USER_EXISTS_MESSAGE, PASSWORD_TOO_SHORT_MESSAGE, \
    USER_DOES_NOT_EXIST_MESSAGE, EDITING_FOREIGN_USER

users_blueprint = Blueprint("user", __name__)


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

    return {"success": True}, 201


@users_blueprint.route("/create_default", methods=["POST"])
@error_handler
def create_default_user():
    """
    Create a default user.
    """
    return create_user()


@users_blueprint.route("", methods=["POST"])
@error_handler
@check_admin_privilege
@check_is_authorised
def create_new_user():
    """
    Create a new user.
    """
    create_user()
    return {"success": True}, 201


@users_blueprint.route("/get-users", methods=["POST"])
@error_handler
@check_is_authorised
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


@users_blueprint.route("/get-user", methods=["POST"])
@error_handler
@check_is_authorised
def get_user():
    """
    Get user by id.
    """
    users_id = request.json["userId"]

    db = DBHandler()
    user = db.session.query(User).with_entities(
        User.id,
        User.username,
        User.name,
        User.email,
        User.is_admin
    ).filter(User.id == users_id).first()

    return {"user": User.as_dict(user)}, 200


@users_blueprint.route("", methods=["DELETE"])
@error_handler
@check_is_authorised
def delete_user():
    """
    Get all users.
    """
    users = request.json["users"]
    db = DBHandler()

    for user in users:
        row = db.session.query(User).filter(User.id == user.get("id")).first()
        if not row:
            raise InvalidFieldsException(message=USER_DOES_NOT_EXIST_MESSAGE)

    user_ids = [user.id for user in users]
    db.session.query(User).where(User.id.in_(user_ids)).delete()
    db.session.commit()

    return {"success": True}, 200


@users_blueprint.route("/edit-user", methods=["POST"])
@error_handler
@check_is_authorised
def edit_user():
    """
    Edit user.
    """
    token = request.headers.get("Authorization", None)
    token = str.replace(str(token), "Bearer ", "")
    token_data = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALGORITHM])
    authorized_user_id = token_data.get("id")

    user_id = request.json["id"]
    username = request.json["username"]
    name = request.json["name"]
    email = request.json["email"]
    is_admin = request.json["isAdmin"]

    if authorized_user_id != user_id:
        raise UserNotAuthorisedException(message=EDITING_FOREIGN_USER)

    db = DBHandler()

    row = db.session.query(User).filter(User.id == user_id).first()
    if not row:
        raise InvalidFieldsException(message=USER_DOES_NOT_EXIST_MESSAGE)
    row.username = username
    row.name = name
    row.email = email
    row.is_admin = is_admin

    db.session.commit()

    return {"success": True}, 200


@users_blueprint.route("/change-password", methods=["POST"])
@error_handler
@check_is_authorised
def change_password():
    """
    Change password.
    """
    password = request.json["password"]
    user_id = request.json["userId"]

    if len(password) < MIN_PASSWORD_LENGTH:
        raise InvalidFieldsException(message=PASSWORD_TOO_SHORT_MESSAGE)

    db = DBHandler()
    password_hash = encrypt(password)
    row = db.session.query(User).filter(User.id == user_id).first()
    if not row:
        raise InvalidFieldsException(message=USER_DOES_NOT_EXIST_MESSAGE)
    row.password = password_hash

    db.session.commit()

    return jsonify({"success": True}), 201
