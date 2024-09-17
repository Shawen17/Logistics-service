from flask import Blueprint, request
from marshmallow import ValidationError
from api.models import Orders, Activity
from api.schemas import OrderSchema, ActivitySchema
from datetime import datetime

from api.auth_middleware import token_required

orders_blueprint = Blueprint("orders_blueprint", __name__)


@orders_blueprint.route("/", methods=["GET"])
@token_required
def get_all_orders(current_user):
    order_schema = OrderSchema(many=True)
    try:
        orders = Orders.select().dicts()
        orders_serialized = order_schema.dump(orders)
    except Exception as err:
        return {"data": [], "message": str(err)}, 500
    return {"data": orders_serialized, "message": "Retrieval Successful"}, 200


@orders_blueprint.route("/inpipeline", methods=["GET"])
@token_required
def get_inprogress_orders(current_user):
    order_schema = OrderSchema(many=True)

    try:
        orders = (
            Orders.select()
            .where(
                (Orders.OrderStatus == "Queued")
                | (Orders.OrderStatus == "InProgress")
                | (Orders.OrderStatus == "QA")
            )
            .dicts()
        )
        orders_serialized = order_schema.dump(orders)
        return {"data": orders_serialized, "message": "Order retrieval successful"}, 200
    except Exception as err:
        return {"data": [], "message": str(err)}, 500


@orders_blueprint.route("/pickerinpipeline", methods=["GET"])
@token_required
def get_pickerinprogress_orders(current_user):
    order_schema = OrderSchema(many=True)
    # user = request.args.get("user")

    print(current_user, flush=True)
    try:
        orders = (
            Orders.select()
            .where(
                ((Orders.OrderStatus == "InProgress") | (Orders.OrderStatus == "QA"))
                & (Orders.TreatedBy == current_user.get("CustomerEmail"))
            )
            .dicts()
        )
        orders_serialized = order_schema.dump(orders)
        return {"data": orders_serialized, "message": "Order retrieval successful"}, 200
    except Exception as err:
        return {"data": [], "message": str(err)}, 500


@orders_blueprint.route("/update_status", methods=["PUT"])
@token_required
def post_update_order_status(current_user):
    order_schema = OrderSchema()
    json_data = request.get_json()
    if not json_data:
        return {"message": "No order data provided!"}, 400

    try:
        order = order_schema.load(json_data)
        print(current_user, flush=True)
        Orders.update(**order).where(Orders.OrderID == order["OrderID"]).execute()

        if order["OrderStatus"] == "InProgress":
            Activity.create(
                OrderID=order["OrderID"],
                Staff=current_user.get("CustomerID"),
                StartTime=datetime.now(),
            )
        elif order["OrderStatus"] == "QA":
            activity = Activity.get(Activity.OrderID == order["OrderID"])
            if activity.StartTime:
                Activity.update(EndTime=datetime.now()).where(
                    Activity.OrderID == order["OrderID"]
                ).execute()

            Activity.update_end_time_and_duration(activity_id=activity.ActivityID)

        elif order["OrderStatus"] == "Queued":

            Activity.delete().where(
                (Activity.OrderID == order["OrderID"])
                & (Activity.Staff == current_user.get("CustomerID"))
            ).execute()
        elif order["OrderStatus"] in ["Cancelled", "Complete"]:
            Activity.update(CheckedBy=current_user.get("CustomerID")).where(
                Activity.OrderID == order["OrderID"]
            ).execute()

    except ValidationError as err:
        return {"message": err.messages}, 422
    except Exception as err:
        print(err, flush=True)
        return {"message": str(err)}, 500
    return {
        "message": f'{order["OrderID"]} updated successfully!',
    }, 200
