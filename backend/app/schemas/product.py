from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.product import ProductStatus

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    price: Decimal = Field(gt=0)
    preparation_time: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

class ProductCreate(ProductBase):
    status: ProductStatus = ProductStatus.ACTIVE
    stock: Optional[int] = None
    marketplaces: List[str] = Field(default_factory=list)
    marketplace_data: Optional[Dict[str, Any]] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    preparation_time: Optional[int] = Field(None, ge=0)
    status: Optional[ProductStatus] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    marketplaces: Optional[List[str]] = None
    marketplace_data: Optional[Dict[str, Any]] = None

class ProductResponse(ProductBase):
    id: UUID
    user_id: UUID
    status: ProductStatus
    stock: Optional[int] = None
    marketplaces: List[str] = Field(default_factory=list)
    marketplace_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductStats(BaseModel):
    total_products: int
    active_products: int
    inactive_products: int
    paused_products: int
    categories: List[Dict[str, Any]]
    top_selling: List[Dict[str, Any]]