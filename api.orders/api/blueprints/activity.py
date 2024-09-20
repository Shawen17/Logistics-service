from api.models import Activity
from api.schemas import ActivitySchema
from flask import Blueprint, request
from api.auth_middleware import token_required
from logger import logger
from datetime import datetime


activity_blueprint = Blueprint("activity_blueprint", __name__)


@activity_blueprint.route("/activities", methods=["GET"])
@token_required
def get_all_activity(current_user):
    activity_schema = ActivitySchema(many=True)
    order = request.args.get("order")
    staff = request.args.get("staff")
    checked_by = request.args.get("checked_by")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    try:
        activities = Activity.select()

        # Conditionally add filters based on the query parameters
        if order:
            activities = activities.where(Activity.OrderID == order)
        if staff:
            activities = activities.where(Activity.Staff == staff)
        if checked_by:
            activities = activities.where(Activity.CheckedBy == checked_by)
        if start_date:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
            activities = activities.where(Activity.StartTime >= start_date_obj)
        if end_date:
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")
            activities = activities.where(Activity.StartTime <= end_date_obj)

        # Apply ordering and limit to return the latest 60 entries
        activities = activities.order_by(Activity.StartTime.desc()).limit(60).dicts()
        activity_serialized = activity_schema.dump(activities)
    except Exception as err:
        logger.error(f"Error in get_all_orders: {err}")
        return {"data": [], "message": str(err)}, 500
    return {"data": activity_serialized, "message": "Retrieval Successful"}, 200
