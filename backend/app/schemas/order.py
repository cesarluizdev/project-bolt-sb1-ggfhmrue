from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.order import OrderStatus, Marketplace

class OrderItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int = Field(gt=0)
    price: Decimal = Field(gt=0)
    observations: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    product_id: Optional[UUID] = None

class OrderItemResponse(OrderItemBase):
    id: UUID
    order_id: UUID
    product_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    marketplace: Marketplace
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    delivery_address: Dict[str, Any]
    restaurant_name: str
    restaurant_phone: Optional[str] = None
    payment_method: str
    delivery_fee: Decimal = Field(default=0, ge=0)
    estimated_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    total: Decimal = Field(gt=0)
    marketplace_order_id: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    estimated_delivery: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: UUID
    order_number: str
    user_id: UUID
    customer_id: Optional[UUID] = None
    status: OrderStatus
    total: Decimal
    marketplace_order_id: Optional[str] = None
    order_date: datetime
    delivered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderStats(BaseModel):
    total_orders: int
    pending_orders: int
    confirmed_orders: int
    preparing_orders: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int
    total_revenue: Decimal
    average_order_value: Decimal