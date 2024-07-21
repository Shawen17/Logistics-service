from flask import Flask
from peewee import Database
from api.blueprints.orders import orders_blueprint
from api.blueprints.products import products_blueprint
from api.models import db
from api.imageUrlData import image_urls
from api.models import Product
from typing import List, Dict
from flask_cors import CORS
import time
from peewee import OperationalError


_URL_PREFIX = "/api"
ORDERS_URL = f"{_URL_PREFIX}/orders"
PRODUCTS_URL = f"{_URL_PREFIX}/products"

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.before_request
def before_request():
    if db.is_closed():
        db.connect()


@app.after_request
def after_request(response):
    if not db.is_closed():
        db.close()
    return response


def connect_to_db(retries=5, delay=5):
    while retries > 0:
        try:
            db.connect()
            print("Database connected successfully.")
            return
        except OperationalError as e:
            print(f"Connection failed: {e}, retrying in {delay} seconds...")
            time.sleep(delay)
            retries -= 1
    raise OperationalError("Could not connect to the database after several attempts")


connect_to_db()


# Function to execute SQL commands from data.sql file
def execute_sql_file(filename: str, db_connection: Database) -> None:
    with open(filename, "r") as f:
        sql_statements = f.read()

    # Remove lines starting with /*! and ending with */;
    filtered_sql = "\n".join(
        line
        for line in sql_statements.split("\n")
        if not (line.strip().startswith("/*!") and line.strip().endswith("*/;"))
    )

    cursor = db_connection.cursor()
    try:
        for statement in filtered_sql.split(";"):
            if statement.strip():
                cursor.execute(statement)
                db_connection.commit()
        print(f"Executed SQL from '{filename}' successfully.")
    except Exception as e:
        db_connection.rollback()
        print(f"Error executing SQL file '{filename}': {e}")
    finally:
        cursor.close()


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


app.register_blueprint(orders_blueprint, url_prefix=ORDERS_URL)
app.register_blueprint(products_blueprint, url_prefix=PRODUCTS_URL)

if __name__ == "__main__":
    try:
        # Execute SQL commands from data.sql before running the Flask app
        execute_sql_file("./db/data.sql", db)

        # Execute photo url upload to ProductPhotoURL
        execute_image_url_injection(image_urls)
        print("SQL file executed successfully.")
        app.run(debug=True, host="0.0.0.0", port=5001)
    except Exception as e:
        print(f"Failed to execute SQL file: {e}")
