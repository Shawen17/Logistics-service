import os
from dotenv import load_dotenv
import secrets
from peewee import (
    Model,
    IntegerField,
    CharField,
    ForeignKeyField,
    Field,
    BooleanField,
    DateTimeField,
    FloatField,
)
from playhouse.mysql_ext import MariaDBConnectorDatabase, JSONField
import re
import math
from datetime import datetime
import pytz
from werkzeug.security import generate_password_hash, check_password_hash
from logger import logger



load_dotenv()

MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", "3306"))


db = MariaDBConnectorDatabase(
    "marz", user=MYSQL_USER, password=MYSQL_PASSWORD, host=MYSQL_HOST, port=MYSQL_PORT
)

PRODUCT_STATUSES = {"Active": "Active", "InActive": "InActive"}

ORDER_STATUSES = {
    "Queued": "Queued",
    "InProgress": "InProgress",
    "QA": "QA",
    "Cancelled": "Cancelled",
    "Complete": "Complete",
}

PRODUCT_STATUSES_SET = set(PRODUCT_STATUSES.values())
ORDER_STATUSES_SET = set(ORDER_STATUSES.values())


class EmailField(CharField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def db_value(self, value):
        # Perform email validation
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError(f"Invalid email address: {value}")
        return value


class EnumField(Field):
    def __init__(self, enum_set, by_value=False, *args, **kwargs):
        self.enum_set = enum_set
        self.by_value = by_value
        super().__init__(*args, **kwargs)

    def db_value(self, value):
        if value not in self.enum_set:
            raise ValueError(
                f"{self.__class__.__name__} Value {value} not in enum set {self.enum_set}"
            )
        return value

    def python_value(self, value):
        return value


class BaseModel(Model):
    class Meta:
        database = db


class Customer(BaseModel):
    CustomerID = IntegerField(primary_key=True, null=False)
    CustomerFirstName = CharField(100, null=False)
    CustomerLastName = CharField(100, null=False)
    CustomerEmail = EmailField(255, null=False)
    CustomerPassword = CharField(255, null=False)
    CustomerNumber = CharField(255, null=False)
    Active = BooleanField(default=True)
    Role = CharField(100, null=False, default="user")

    class Meta:
        table_name = "Customer"

    def save(self, *args, **kwargs):
        if self.CustomerPassword and not self.CustomerPassword.startswith(
            "pbkdf2:sha256"
        ):
            self.CustomerPassword = generate_password_hash(self.CustomerPassword)
        return super(Customer, self).save(*args, **kwargs)

    @classmethod
    def validate_login(cls, email, password):
        try:
            customer = cls.get(cls.CustomerEmail == email)
        except cls.DoesNotExist:
            return None, "Invalid email or password"

        if check_password_hash(customer.CustomerPassword, password):
            return customer, None
        else:
            return None, "Invalid email or password"


class Product(BaseModel):
    ProductID = IntegerField(primary_key=True, null=False)
    ProductName = CharField(100, null=False)
    ProductPhotoURL = CharField(255, null=False)
    ProductStatus = EnumField(PRODUCT_STATUSES_SET, null=False)
    ProductDesc = CharField(255, null=True)

    class Meta:
        table_name = "Product"


class Orders(BaseModel):
    OrderID = IntegerField(primary_key=True, null=False)
    ref = CharField(50,null=True)
    OrderStatus = EnumField(ORDER_STATUSES_SET, null=False)
    Products = JSONField()
    CustomerID = CharField(50, null=True)
    PhoneNumber = CharField(30, null=True)
    Amount = FloatField(null=True)
    State = CharField(100, null=True)
    Address = CharField(150, null=True)
    OrderDate = CharField(
        default=datetime.now(pytz.timezone("US/Eastern")).strftime("%Y-%m-%d %H:%M:%S")
    )
    TreatedBy = CharField(150, null=True)
    Fullfillment = BooleanField(default=False)

    class Meta:
        table_name = "Orders"

    
    def save(self, *args, **kwargs):
        while not self.ref:
            ref = secrets.token_urlsafe(16)
            object_with_similar_ref = Orders.select().where(Orders.ref==ref)
            if not object_with_similar_ref:
                self.ref=ref
        super().save(*args, **kwargs)


    def __str__(self):
        return f"<Order(OrderID={self.OrderID}, OrderStatus={self.OrderStatus}, CustomerID={self.CustomerID})>"


class Activity(BaseModel):
    ActivityID = IntegerField(primary_key=True, null=False)
    OrderID = ForeignKeyField(
        Orders, backref="activities", column_name="OrderID", null=False
    )
    Staff = ForeignKeyField(
        Customer, backref="staff_activities", column_name="Staff", null=False
    )
    StartTime = DateTimeField()
    EndTime = DateTimeField(null=True)
    Duration = FloatField(null=True)
    QAStart = DateTimeField(null=True)
    QAEnd = DateTimeField(null=True)
    QADuration= FloatField(null=True)
    CheckedBy = ForeignKeyField(
        Customer, backref="checked_activities", column_name="CheckedBy", null=True
    )

    class Meta:
        table_name = "Activity"

    def __str__(self):
        return self.ActivityID

    @classmethod
    def update_end_time_and_duration(cls, activity_id):
        activity = cls.get(cls.ActivityID == activity_id)
        if activity.StartTime and not activity.QAEnd:
            try:
                duration_seconds = (
                    activity.EndTime - activity.StartTime
                ).total_seconds()
                activity.Duration = math.ceil(duration_seconds / 60.0)
                activity.save()
            except Exception as e:
                logger.error(f"Update Duration encountered Error: {e}")
        elif activity.QAEnd:
            duration_seconds = (
                    activity.QAEnd - activity.QAStart
                ).total_seconds()
            activity.QADuration = math.ceil(duration_seconds / 60.0)
            activity.save()


class Delivery(BaseModel):
    DeliveryID = IntegerField(primary_key=True, null=False)
    OrderID = ForeignKeyField(
        Orders, backref="delivery", column_name="OrderID", null=False
    )
    DeliveredBy = ForeignKeyField(
        Customer, backref='delivery',column_name='DeliveredBy',null=True
    )
    DeliveryDate = DateTimeField(null=True)

    class Meta:
        table_name = "Delivery"
