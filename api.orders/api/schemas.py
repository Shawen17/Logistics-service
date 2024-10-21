from marshmallow import Schema, fields, pre_load, EXCLUDE

# from .models import EnumField
from enum import Enum


class ProductStatusEnum(Enum):
    Active = "Active"
    InActive = "InActive"


class OrderSchema(Schema):
    OrderID = fields.Int(required=False,allow_none=True )
    ref = fields.Str(required=False,allow_none=True)
    OrderStatus = fields.Str()
    CustomerID = fields.Str()
    Products = fields.Dict()
    State = fields.Str()
    Address = fields.Str()
    OrderDate = fields.Str()
    TreatedBy = fields.Str(required=False, allow_none=True)
    PhoneNumber = fields.Str(required=False,allow_none=True)
    Amount = fields.Float(required=False,allow_none=True)
    Fullfillment= fields.Boolean(required=False,allow_none=True)
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
    QAStart = fields.DateTime(format="%Y-%m-%d %H:%M:%S", null=True)
    QAEnd = fields.DateTime(format="%Y-%m-%d %H:%M:%S", null=True)
    QADuration = fields.Float()

    @pre_load
    def make_object(self, data, **kwargs):
        return data


class DeliverySchema(Schema):
    DeliveryID = fields.Int(dump_only=True)
    OrderID = fields.Int()
    DeliveredBy = fields.Int(required=False, allow_none=True)
    DeliveryDate = fields.DateTime(format="%Y-%m-%d %H:%M:%S", null=True,allow_none=True,required=False )
    

    @pre_load
    def make_object(self, data, **kwargs):
        return data
