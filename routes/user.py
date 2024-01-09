from flask import Blueprint

from db.db import DBHandler
from models.models import User
from utils.cipher import encrypt

auth_blueprint = Blueprint('user', __name__)


@auth_blueprint.route('/', methods=["POST"])
def user(username: str, password: str):
    """
    Create a new user.
    """
    password_hash = encrypt(password)
    db = DBHandler()
    db.session.add(User(username=username, password=password_hash))
    db.session.commit()



