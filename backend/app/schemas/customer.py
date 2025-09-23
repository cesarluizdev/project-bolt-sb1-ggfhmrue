from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal

class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    birth_date: Optional[datetime] = None
    address: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None

class CustomerCreate(CustomerBase):
    status: str = "active"
    preferences: Optional[Dict[str, Any]] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    birth_date: Optional[datetime] = None
    address: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None

class CustomerResponse(CustomerBase):
    id: UUID
    user_id: UUID
    total_orders: int
    total_spent: Decimal
    average_order_value: Decimal
    favorite_marketplace: Optional[str] = None
    status: str
    preferences: Optional[Dict[str, Any]] = None
    registration_date: datetime
    last_order_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CustomerStats(BaseModel):
    total_customers: int
    active_customers: int
    inactive_customers: int
    vip_customers: int
    average_ticket: Decimal
    top_customers: List[Dict[str, Any]]