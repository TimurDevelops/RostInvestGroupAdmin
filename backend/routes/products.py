from flask import Blueprint, request

from backend.db.db import DBHandler
from backend.models.models import Product, Category
from backend.utils.decorators import check_admin_privilege, check_is_authorised
from backend.utils.error_handler import error_handler
from backend.utils.errors import InvalidFieldsException
from backend.utils.messages import MISSING_REQUIRED_FIELDS_MESSAGE, \
    CATEGORY_DOES_NOT_EXIST_MESSAGE, PRODUCT_DOES_NOT_EXIST_MESSAGE

users_blueprint = Blueprint("products", __name__)


@users_blueprint.route("", methods=["POST"])
@error_handler
@check_admin_privilege
@check_is_authorised
def create_new_product():
    """
    Create a new product.
    """
    title = request.json["productTitle"]
    description = request.json["productDescription"]
    parent_category_id = request.json["parentProductId"]
    product_image = request.json["productImage"]
    product_price = request.json["productPrice"]

    if not title or not description or not product_image or not product_price:
        raise InvalidFieldsException(message=MISSING_REQUIRED_FIELDS_MESSAGE)

    db = DBHandler()
    if parent_category_id:
        category = db.session.query(Category).filter(Category.id == parent_category_id).first()
        if not category:
            raise InvalidFieldsException(message=CATEGORY_DOES_NOT_EXIST_MESSAGE)

    db.session.add(Product(title=title, description=description, parent_category_id=parent_category_id,
                           product_image=product_image, product_price=product_price))
    db.session.commit()

    return {"success": True}, 201


@users_blueprint.route("/get-products", methods=["POST"])
@error_handler
@check_is_authorised
def get_products():
    """
    Get all products.
    """
    db = DBHandler()
    products = db.session.query(Product).all()

    return {"users": [Product.as_dict(product) for product in products]}, 200


@users_blueprint.route("/get-product", methods=["POST"])
@error_handler
@check_is_authorised
def get_product():
    """
    Get product by id.
    """
    product_id = request.json["productId"]

    db = DBHandler()
    product = db.session.query(Product).filter(Product.id == product_id).first()

    return {"product": Product.as_dict(product)}, 200


@users_blueprint.route("/get-products-by-parent", methods=["POST"])
@error_handler
@check_is_authorised
def get_products_by_parent():
    """
    Get product by id.
    """
    category_id = request.json["categoryId"]
    db = DBHandler()

    category = db.session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise InvalidFieldsException(message=CATEGORY_DOES_NOT_EXIST_MESSAGE)

    products = db.session.query(Product).filter(Product.parent_category_id == category_id).all()

    return {"users": [Product.as_dict(product) for product in products]}, 200


def delete_image(image_path):
    print(image_path)


@users_blueprint.route("", methods=["DELETE"])
@error_handler
@check_is_authorised
def delete_products():
    """
    Delete products.
    """
    products = request.json["products"]
    db = DBHandler()

    for product in products:
        row = db.session.query(Product).filter(Product.id == product.get("id")).first()
        if not row:
            raise InvalidFieldsException(message=CATEGORY_DOES_NOT_EXIST_MESSAGE)

        delete_image(row.product_image)

    products_ids = [product.id for product in products]
    db.session.query(Product).where(Product.id.in_(products_ids)).delete()
    db.session.commit()

    return {"success": True}, 200


@users_blueprint.route("/edit-product", methods=["POST"])
@error_handler
@check_is_authorised
def edit_product():
    """
    Edit user.
    """

    product_id = request.json["productId"]
    product_title = request.json["productTitle"]
    product_description = request.json["productDescription"]
    parent_category_id = request.json["productParentCategoryId"]
    product_image = request.json["productImage"]
    product_price = request.json["productPrice"]

    db = DBHandler()
    category = db.session.query(Category).filter(Category.id == parent_category_id).first()
    if not category:
        raise InvalidFieldsException(message=CATEGORY_DOES_NOT_EXIST_MESSAGE)

    product = db.session.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise InvalidFieldsException(message=PRODUCT_DOES_NOT_EXIST_MESSAGE)

    product.product_title = product_title
    product.product_description = product_description
    product.parent_category_id = parent_category_id
    product.product_image = product_image
    product.product_price = product_price

    db.session.commit()

    return {"success": True}, 200
