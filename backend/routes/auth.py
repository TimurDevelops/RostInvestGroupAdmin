import jwt
from flask import Blueprint, request, jsonify

from backend.db.db import DBHandler
from backend.models.models import User
from backend.settings import JWT_KEY
from backend.utils.cipher import encrypt
from backend.utils.error_handler import error_handler
from backend.utils.errors import LoginException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, WRONG_LOGIN_PASSWORD_MESSAGE

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('', methods=["POST"])
@error_handler
def authenticate_user():
    username = request.json["username"]
    password = request.json["password"]
    if not username or not password:
        raise LoginException(message=WRONG_LOGIN_PASSWORD_MESSAGE)
    db = DBHandler()
    user = db.session.query(User).filter(User.username == username).first()
    if not user:
        raise LoginException(message=WRONG_LOGIN_PASSWORD_MESSAGE)
    if user.password != encrypt(password):
        raise LoginException(message=WRONG_LOGIN_PASSWORD_MESSAGE)

    encoded_jwt = jwt.encode({"user_id": user.id}, JWT_KEY, algorithm="HS256")
    return jsonify({"token": encoded_jwt}), 200
