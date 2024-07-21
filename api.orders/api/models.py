import os
from dotenv import load_dotenv
from peewee import Model, IntegerField, CharField, ForeignKeyField, Field
from playhouse.mysql_ext import MariaDBConnectorDatabase

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

    class Meta:
        table_name = "Customer"


class Product(BaseModel):
    ProductID = IntegerField(primary_key=True, null=False)
    ProductName = CharField(100, null=False)
    ProductPhotoURL = CharField(255, null=False)
    ProductStatus = EnumField(PRODUCT_STATUSES_SET, null=False)

    class Meta:
        table_name = "Product"


class Orders(BaseModel):
    OrderID = IntegerField(primary_key=True, null=False)
    OrderStatus = EnumField(ORDER_STATUSES_SET, null=False)
    ProductID = ForeignKeyField(
        Product, field="ProductID", null=False, column_name="ProductID"
    )
    CustomerID = ForeignKeyField(
        Customer, field="CustomerID", null=False, column_name="CustomerID"
    )

    class Meta:
        table_name = "Orders"
