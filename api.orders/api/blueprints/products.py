from flask import Blueprint, request
from marshmallow import ValidationError
from api.models import Product
from api.schemas import ProductSchema

products_blueprint = Blueprint("products_blueprint", __name__)


@products_blueprint.route("/", methods=["GET", "POST"])
def get_or_post_products():
    if request.method == "GET":
        product_schema = ProductSchema(many=True)
        try:
            products = Product.select().where(Product.ProductStatus == "Active").dicts()
            products_serialized = product_schema.dump(list(products))
            return {"data": products_serialized, "message": "Retrieval Successful"}, 200
        except Exception as err:
            return {"data": [], "message": str(err)}, 500

    product_schema = ProductSchema()
    try:
        product_data = product_schema.load(request.json)
        data = {
            "ProductName": product_data["ProductName"],
            "ProductPhotoURL": product_data.get("ProductPhotoURL", ""),
            "ProductStatus": product_data["ProductStatus"],
        }
        new_product = Product.create(**data)
        product_serialized = product_schema.dump(new_product)
        return {
            "data": product_serialized,
            "message": "Product added successfully",
        }, 201
    except ValidationError as err:
        return {"message": err.messages}, 422
    except Exception as err:
        return {"data": [], "message": str(err)}, 500


@products_blueprint.route("/update_status", methods=["PUT"])
def update_product_status():
    product_schema = ProductSchema()
    json_data = request.get_json()
    if not json_data:
        return {"message": "No product provided"}, 400
    try:
        product = product_schema.load(json_data)
        Product.update(**product).where(
            Product.ProductID == product["ProductID"]
        ).execute()
    except ValidationError as err:
        return {"message": err.messages}, 422
    except Exception as err:
        return {"message": str(err)}, 500
    return {"message": f'{product["ProductID"]} updated successfully!'}, 200
