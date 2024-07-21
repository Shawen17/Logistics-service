from pytest import fixture
from app import PRODUCTS_URL
from api.blueprints.products import products_blueprint
from api.models import Product, Customer, Orders
import json


@fixture()
def test_client(test_app):
    test_app.register_blueprint(products_blueprint, url_prefix=PRODUCTS_URL)
    return test_app.test_client()


@fixture()
def init_db():
    customer = Customer(CustomerFirstName="Test1", CustomerLastName="McTest1")
    customer.save()

    active_product = Product(
        ProductName="Test1", ProductPhotoURL="/test1", ProductStatus="Active"
    )
    active_product.save()
    in_active_product = Product(
        ProductName="Test2", ProductPhotoURL="/test2", ProductStatus="InActive"
    )
    in_active_product.save()

    orders = [
        Orders(
            **{
                "OrderStatus": "Queued",
                "ProductID": active_product.ProductID,
                "CustomerID": customer.CustomerID,
            }
        ),
        Orders(
            **{
                "OrderStatus": "Complete",
                "ProductID": active_product.ProductID,
                "CustomerID": customer.CustomerID,
            }
        ),
        Orders(
            **{
                "OrderStatus": "Cancelled",
                "ProductID": active_product.ProductID,
                "CustomerID": customer.CustomerID,
            }
        ),
        Orders(
            **{
                "OrderStatus": "Cancelled",
                "ProductID": in_active_product.ProductID,
                "CustomerID": customer.CustomerID,
            }
        ),
    ]
    for order in orders:
        order.save()
    return orders, [active_product, in_active_product], [customer]


def test_get_all_products(test_client, init_db):
    response = test_client.get(f"{PRODUCTS_URL}/")
    assert response.status_code == 200
    deserialized_response = json.loads(response.data)
    data = deserialized_response.get("data")
    assert data is not None
    assert len(data) == 1
    message = deserialized_response.get("message")
    assert message == "Retrieval Successful"


def test_post_update_product_status(test_client, init_db):
    [_, [active_product, _], [_]] = init_db
    ProductID = active_product.ProductID
    print(ProductID)
    response = test_client.put(
        f"{PRODUCTS_URL}/update_status",
        json={
            "ProductID": ProductID,
            "ProductName": "Test3",
            "ProductPhotoURL": "/test3",
            "ProductStatus": "Active",
        },
    )
    assert response.status_code == 200
    deserialized_response = json.loads(response.data)
    message = deserialized_response.get("message")
    assert message == f"{ProductID} updated successfully!"


def test_post_update_product_status_empty_json(test_client):
    response = test_client.put(f"{PRODUCTS_URL}/update_status", json={})
    assert response.status_code == 400
    deserialized_response = json.loads(response.data)
    message = deserialized_response.get("message")
    assert message == "No product provided"


def test_post_update_product_status_validation_error(test_client):
    response = test_client.put(
        f"{PRODUCTS_URL}/update_status",
        json={"test": "test"},
    )
    assert response.status_code == 422
