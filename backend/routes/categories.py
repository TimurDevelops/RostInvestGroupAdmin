import jwt
from flask import Blueprint, request, jsonify

from backend.db.db import DBHandler
from backend.models.models import User, Category
from backend.settings import MIN_PASSWORD_LENGTH, JWT_ALGORITHM, JWT_KEY
from backend.utils.cipher import encrypt
from backend.utils.decorators import check_admin_privilege, check_is_authorised
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException, UserNotAuthorisedException
from backend.utils.messages import MISSING_LOGIN_PASSWORD_MESSAGE, USER_EXISTS_MESSAGE, PASSWORD_TOO_SHORT_MESSAGE, \
    USER_DOES_NOT_EXIST_MESSAGE, EDITING_FOREIGN_USER, MISSING_REQUIRED_FIELDS_MESSAGE, CATEGORY_DOES_NOT_EXIST_MESSAGE

users_blueprint = Blueprint("categories", __name__)


@users_blueprint.route("", methods=["POST"])
@error_handler
@check_admin_privilege
@check_is_authorised
def create_new_category():
    """
    Create a new category.
    """
    category_title = request.json["categoryTitle"]
    parent_category_id = request.json["parentCategoryId"]
    category_image = request.json["categoryImage"]

    if not category_title or not parent_category_id or not category_image:
        raise InvalidFieldsException(message=MISSING_REQUIRED_FIELDS_MESSAGE)

    db = DBHandler()
    db.session.add(Category(title=category_title, parent_category_id=parent_category_id, category_image=category_image))
    db.session.commit()

    return {"success": True}, 201


@users_blueprint.route("/get-categories", methods=["POST"])
@error_handler
@check_is_authorised
def get_categories():
    """
    Get all categories.
    """
    db = DBHandler()
    categories = db.session.query(Category).all()

    return {"users": [Category.as_dict(category) for category in categories]}, 200


@users_blueprint.route("/get-category", methods=["POST"])
@error_handler
@check_is_authorised
def get_category():
    """
    Get category by id.
    """
    category_id = request.json["categoryId"]

    db = DBHandler()
    category = db.session.query(Category).filter(Category.id == category_id).first()

    return {"user": Category.as_dict(category)}, 200


@users_blueprint.route("/get-category-by-parent", methods=["POST"])
@error_handler
@check_is_authorised
def get_categories_by_parent():
    """
    Get category by id.
    """
    category_id = request.json["categoryId"]

    db = DBHandler()
    categories = db.session.query(Category).filter(Category.parent_category_id == category_id).all()

    return {"users": [Category.as_dict(category) for category in categories]}, 200


def delete_image(image_path):
    print(image_path)


@users_blueprint.route("", methods=["DELETE"])
@error_handler
@check_is_authorised
def delete_category():
    """
    Delete category.
    """
    categories = request.json["categories"]
    db = DBHandler()

    for category in categories:
        row = db.session.query(Category).filter(Category.id == category.get("id")).first()
        if not row:
            raise InvalidFieldsException(message=CATEGORY_DOES_NOT_EXIST_MESSAGE)

        delete_image(category.parent_category_id)

    categories_ids = [category.id for category in categories]
    db.session.query(Category).where(User.id.in_(categories_ids)).delete()
    db.session.commit()

    return {"success": True}, 200


@users_blueprint.route("/edit-category", methods=["POST"])
@error_handler
@check_is_authorised
def edit_category():
    """
    Edit user.
    """

    category_id = request.json["categoryId"]
    category_title = request.json["categoryTitle"]
    parent_category_id = request.json["parentCategoryId"]
    category_image = request.json["categoryImage"]

    db = DBHandler()

    row = db.session.query(Category).filter(Category.id == category_id).first()
    if not row:
        raise InvalidFieldsException(message=USER_DOES_NOT_EXIST_MESSAGE)
    row.category_title = category_title
    row.parent_category_id = parent_category_id
    row.category_image = category_image

    db.session.commit()

    return {"success": True}, 200
