from flask import Flask, request
from api.blueprints.orders import orders_blueprint
from api.blueprints.products import products_blueprint
from api.blueprints.customers import customers_blueprint
from api.models import db
from api.imageUrlData import image_urls
from api.models import Product
from typing import List, Dict
from flask_cors import CORS
import time
from peewee import OperationalError
import os
from prometheus_client import Counter, generate_latest
from dotenv import load_dotenv

load_dotenv()


SECRET_KEY = os.environ.get("SECRET_KEY") or "this is a secret"
_URL_PREFIX = "/api"
ORDERS_URL = f"{_URL_PREFIX}/orders"
PRODUCTS_URL = f"{_URL_PREFIX}/products"
CUSTOMERS_URL = f"{_URL_PREFIX}/users"

app = Flask(__name__)

app.config["SECRET_KEY"] = SECRET_KEY

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

REQUEST_COUNT = Counter(
    "app_requests_total", "Total webapp request count", ["method", "endpoint"]
)


@app.before_request
def before_request():
    REQUEST_COUNT.labels(method=request.method, endpoint=request.path).inc()
    if db.is_closed():
        db.connect()


@app.after_request
def after_request(response):
    if not db.is_closed():
        db.close()
    return response


def connect_to_db(retries=5, delay=3):
    delay_factor = 1
    while retries > 0:
        try:
            db.connect()
            print("Database connected successfully.")
            return
        except OperationalError as e:
            delay_time = delay * delay_factor
            print(f"Connection failed: {e}, retrying in {delay_time} seconds...")
            time.sleep(delay_time)
            delay_factor += 1
            retries -= 1
    raise OperationalError("Could not connect to the database after several attempts")


connect_to_db()


# function to populate ProductPhotoURL Table column
def execute_image_url_injection(images: List[Dict[str, str]]) -> None:
    try:
        for image in images:
            product = Product.get(Product.ProductID == image["id"])
            product.ProductPhotoURL = image["photo"]
            product.save()
    except Exception as e:
        print(f"Error updating product: {e}")


@app.route("/")
def index():
    return "Welcome to your Flask Application!"


@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {"Content-Type": "text/plain; charset=utf-8"}


app.register_blueprint(orders_blueprint, url_prefix=ORDERS_URL)
app.register_blueprint(products_blueprint, url_prefix=PRODUCTS_URL)
app.register_blueprint(customers_blueprint, url_prefix=CUSTOMERS_URL)

if __name__ == "__main__":
    try:
        # Execute photo url upload to ProductPhotoURL
        execute_image_url_injection(image_urls)
        print("SQL file executed successfully.")
        app.run(debug=True, host="0.0.0.0", port=5001)
    except Exception as e:
        print(f"Failed to execute SQL file: {e}")
