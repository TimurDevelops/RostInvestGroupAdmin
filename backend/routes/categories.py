import jwt
from flask import Blueprint, request

from backend.db.db import DBHandler
from backend.models.models import Category, Product
from backend.settings import JWT_ALGORITHM, JWT_KEY
from backend.utils.decorators import check_admin_privilege, check_is_authorised
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException
from backend.utils.messages import USER_DOES_NOT_EXIST_MESSAGE, MISSING_REQUIRED_FIELDS_MESSAGE, \
    CATEGORY_DOES_NOT_EXIST_MESSAGE

categories_blueprint = Blueprint("categories", __name__)


@categories_blueprint.route("", methods=["POST"])
@error_handler
@check_admin_privilege
@check_is_authorised
def create_new_category():
    """
    Create a new category.
    """
    token = request.headers.get("Authorization", None)
    token = str.replace(str(token), "Bearer ", "")
    token_data = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALGORITHM])
    authorized_user_name = token_data.get("username")

    category_title = request.json["categoryTitle"]
    parent_category_id = request.json["parentCategoryId"]
    category_image = request.json["categoryImage"]

    if not category_title or not category_image:
        raise InvalidFieldsException(message=MISSING_REQUIRED_FIELDS_MESSAGE)

    db = DBHandler()
    db.session.add(Category(title=category_title, parent_category_id=parent_category_id,
                            category_image=category_image, last_editor=authorized_user_name))
    db.session.commit()

    return {"success": True}, 201


@categories_blueprint.route("/get-categories", methods=["POST"])
@error_handler
@check_is_authorised
def get_categories():
    """
    Get all categories.
    """
    db = DBHandler()
    categories = db.session.query(Category).all()

    return {"categories": [Category.as_dict(category) for category in categories]}, 200


@categories_blueprint.route("/get-category", methods=["POST"])
@error_handler
@check_is_authorised
def get_category():
    """
    Get category by id.
    """
    category_id = request.json["categoryId"]

    db = DBHandler()
    category = db.session.query(Category).filter(Category.id == category_id).first()

    return {"category": Category.as_dict(category)}, 200


@categories_blueprint.route("/get-categories-by-parent", methods=["POST"])
@error_handler
@check_is_authorised
def get_categories_by_parent():
    """
    Get category by id.
    """
    category_id = request.json["categoryId"]

    db = DBHandler()
    categories = db.session.query(Category).filter(Category.parent_category_id == category_id).all()

    return {"categories": [Category.as_dict(category) for category in categories]}, 200


def delete_image(image_path):
    print(image_path)


@categories_blueprint.route("", methods=["DELETE"])
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

        delete_image(row.category_image)
        products = db.session.query(Product).filter(Product.parent_category_id == row.id).all()
        for product in products:
            product.parent_category_id = None

    categories_ids = [category.id for category in categories]
    db.session.query(Category).where(Category.id.in_(categories_ids)).delete()
    db.session.commit()

    return {"success": True}, 200


@categories_blueprint.route("/edit-category", methods=["POST"])
@error_handler
@check_is_authorised
def edit_category():
    """
    Edit category.
    """
    token = request.headers.get("Authorization", None)
    token = str.replace(str(token), "Bearer ", "")
    token_data = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALGORITHM])
    authorized_user_name = token_data.get("username")

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
    row.last_editor = authorized_user_name

    db.session.commit()

    return {"success": True}, 200


@categories_blueprint.route("/get-tree", methods=["POST"])
@error_handler
@check_is_authorised
def get_category_tree():
    """
    Get tree of categories.
    """

    db = DBHandler()

    categories = db.session.query(Category).all()

    for category in categories:
        category.children = [i for i in categories if i.parent_category_id == category.id]

    return {"success": True, "categories": [category for category in categories if
                                            category.parent_category_id is None]}, 200
