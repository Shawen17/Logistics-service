from marshmallow import Schema, fields, pre_load, EXCLUDE

# from .models import EnumField
from enum import Enum


class ProductStatusEnum(Enum):
    Active = "Active"
    InActive = "InActive"


class OrderSchema(Schema):
    OrderID = fields.Int()
    OrderStatus = fields.Str()
    CustomerID = fields.Int()
    Products = fields.Dict()
    State = fields.Str()
    Address = fields.Str()
    OrderDate = fields.Str()
    TreatedBy = fields.Str()

    class Meta:
        unknown = EXCLUDE

    @pre_load
    def make_object(self, data, **kwargs):
        return data


class ProductSchema(Schema):
    ProductID = fields.Int()
    ProductName = fields.Str()
    ProductPhotoURL = fields.Str()
    ProductStatus = ProductStatus = fields.Str(
        required=True, validate=lambda x: x in ProductStatusEnum.__members__
    )
    ProductDesc = fields.Str()

    @pre_load
    def make_object(self, data, **kwargs):
        return data


class CustomerSchema(Schema):
    CustomerID = fields.Int()
    CustomerFirstName = fields.String()
    CustomerLastName = fields.String()
    CustomerEmail = fields.String()
    CustomerPassword = fields.String()
    CustomerNumber = fields.String()
    Active = fields.Boolean()
    Role = fields.String()

    @pre_load
    def make_object(self, data, **kwargs):
        return data


class ActivitySchema(Schema):
    ActivityID = fields.Int(dump_only=True)
    OrderID = fields.Int()
    Staff = fields.Int()
    StartTime = fields.DateTime(format="%Y-%m-%d %H:%M:%S", null=True)
    EndTime = fields.DateTime(format="%Y-%m-%d %H:%M:%S", null=True)
    Duration = fields.Float()
    CheckedBy = fields.Int()

    @pre_load
    def make_object(self, data, **kwargs):
        return data
