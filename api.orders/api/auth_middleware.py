from functools import wraps
import jwt
from flask import request, abort, current_app
from api.models import Customer
from dotenv import load_dotenv
import redis
import os


load_dotenv()

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
redis_client = redis.Redis(host=REDIS_HOST, port=6379, db=0)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized",
            }, 401

        # Check if token exists in Redis
        if redis_client.exists(token):
            # If token exists, retrieve user data from Redis
            current_user = redis_client.get(token).decode("utf-8")
            current_user = eval(current_user)  # Convert string back to dict
        else:
            try:
                # If token doesn't exist in Redis, verify token and store user data
                data = jwt.decode(
                    token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
                )
                user_id = data["user_id"]
                current_user_query = Customer.select().where(
                    Customer.CustomerID == user_id
                )
                current_user = current_user_query.dicts().get()
                if current_user is None:
                    return {
                        "message": "Invalid Authentication token!",
                        "data": None,
                        "error": "Unauthorized",
                    }, 401
                # Store user data in Redis
                redis_client.set(token, str(current_user))  # Convert dict to string
                redis_client.expire(token, 3600)  # Set TTL (1 hour)
            except Exception as e:
                return {
                    "message": "Something went wrong",
                    "data": None,
                    "error": str(e),
                }, 500

        if not current_user["Active"]:
            abort(403)

        return f(current_user, *args, **kwargs)

    return decorated
