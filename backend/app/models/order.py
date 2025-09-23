from sqlalchemy import Column, String, DateTime, Numeric, Integer, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Marketplace(str, enum.Enum):
    Ifood = "Ifood"
    RAPPI = "Rappi"
    FOOD99 = "99Food"
    KEETA = "Keeta"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String(100), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=True)
    
    # Marketplace info
    marketplace = Column(ENUM(Marketplace), nullable=False)
    marketplace_order_id = Column(String(255), nullable=True)
    
    # Order details
    status = Column(ENUM(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), default=0)
    payment_method = Column(String(100), nullable=False)
    
    # Customer info (denormalized for performance)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=True)
    customer_phone = Column(String(20), nullable=True)
    
    # Delivery address
    delivery_address = Column(JSON, nullable=False)  # Store as JSON
    
    # Restaurant info
    restaurant_name = Column(String(255), nullable=False)
    restaurant_phone = Column(String(20), nullable=True)
    
    # Timestamps
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    estimated_delivery = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Additional info
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    customer = relationship("Customer", back_populates="orders")
    
    def __repr__(self):
        return f"<Order(id={self.id}, order_number={self.order_number}, status={self.status})>"

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    
    # Item details
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Numeric(10, 2), nullable=False)
    observations = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
    
    def __repr__(self):
        return f"<OrderItem(id={self.id}, name={self.name}, quantity={self.quantity})>"