from sqlalchemy import Column, String, DateTime, Numeric, Integer, Text, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, ENUM, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum

class ProductStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PAUSED = "paused"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Product details
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    preparation_time = Column(Integer, default=0)  # in minutes
    
    # Status and availability
    status = Column(ENUM(ProductStatus), default=ProductStatus.ACTIVE, nullable=False)
    stock = Column(Integer, nullable=True)  # null means unlimited
    
    # Media and metadata
    image_url = Column(Text, nullable=True)
    tags = Column(ARRAY(String), default=list)
    
    # Marketplace sync
    marketplaces = Column(ARRAY(String), default=list)  # List of marketplace IDs where synced
    marketplace_data = Column(JSON, nullable=True)  # Store marketplace-specific data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    order_items = relationship("OrderItem", back_populates="product")
    
    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, status={self.status})>"