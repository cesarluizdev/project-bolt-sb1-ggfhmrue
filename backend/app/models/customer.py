from sqlalchemy import Column, String, DateTime, Integer, Numeric, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Personal information
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    birth_date = Column(DateTime(timezone=True), nullable=True)
    
    # Address information (stored as JSON for flexibility)
    address = Column(JSON, nullable=True)
    
    # Customer statistics
    total_orders = Column(Integer, default=0)
    total_spent = Column(Numeric(10, 2), default=0)
    average_order_value = Column(Numeric(10, 2), default=0)
    favorite_marketplace = Column(String(50), nullable=True)
    
    # Status and preferences
    status = Column(String(20), default="active")  # active, inactive, vip
    preferences = Column(JSON, nullable=True)  # notifications, promotions, etc.
    notes = Column(Text, nullable=True)
    
    # Timestamps
    registration_date = Column(DateTime(timezone=True), server_default=func.now())
    last_order_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    orders = relationship("Order", back_populates="customer")
    
    def __repr__(self):
        return f"<Customer(id={self.id}, name={self.name}, email={self.email})>"