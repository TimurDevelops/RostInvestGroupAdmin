from flask import Blueprint

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/user', methods=["POST"])
def user():
    return "This is an example app"
