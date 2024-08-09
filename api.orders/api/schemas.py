from marshmallow import Schema, fields, pre_load

# from .models import EnumField
from enum import Enum


class ProductStatusEnum(Enum):
    Active = "Active"
    InActive = "InActive"


class OrderSchema(Schema):
    OrderID = fields.Int()
    OrderStatus = fields.Str()
    CustomerID = fields.Int()
    ProductID = fields.Int()

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

    @pre_load
    def make_object(self, data, **kwargs):
        return data
