from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from uuid import UUID
from app.models.product import Product, ProductStatus
from app.schemas.product import ProductCreate, ProductUpdate, ProductStats
import logging

logger = logging.getLogger(__name__)

class ProductService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_product(self, product_data: ProductCreate, user_id: UUID) -> Product:
        """Create a new product"""
        try:
            db_product = Product(
                user_id=user_id,
                name=product_data.name,
                description=product_data.description,
                category=product_data.category,
                price=product_data.price,
                preparation_time=product_data.preparation_time,
                status=product_data.status,
                stock=product_data.stock,
                image_url=product_data.image_url,
                tags=product_data.tags,
                marketplaces=product_data.marketplaces,
                marketplace_data=product_data.marketplace_data
            )
            
            self.db.add(db_product)
            self.db.commit()
            self.db.refresh(db_product)
            
            logger.info(f"Product created: {db_product.name}")
            return db_product
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating product: {e}")
            raise
    
    def get_products(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Product]:
        """Get products for a user"""
        return (
            self.db.query(Product)
            .filter(Product.user_id == user_id)
            .order_by(desc(Product.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_product(self, product_id: UUID, user_id: UUID) -> Optional[Product]:
        """Get a specific product"""
        return (
            self.db.query(Product)
            .filter(Product.id == product_id, Product.user_id == user_id)
            .first()
        )
    
    def update_product(self, product_id: UUID, user_id: UUID, product_data: ProductUpdate) -> Optional[Product]:
        """Update a product"""
        try:
            db_product = self.get_product(product_id, user_id)
            if not db_product:
                return None
            
            update_data = product_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_product, field, value)
            
            self.db.commit()
            self.db.refresh(db_product)
            
            logger.info(f"Product updated: {db_product.name}")
            return db_product
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating product: {e}")
            raise
    
    def delete_product(self, product_id: UUID, user_id: UUID) -> bool:
        """Delete a product"""
        try:
            db_product = self.get_product(product_id, user_id)
            if not db_product:
                return False
            
            self.db.delete(db_product)
            self.db.commit()
            
            logger.info(f"Product deleted: {product_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting product: {e}")
            raise
    
    def get_products_by_category(self, user_id: UUID, category: str) -> List[Product]:
        """Get products by category"""
        return (
            self.db.query(Product)
            .filter(Product.user_id == user_id, Product.category == category)
            .order_by(Product.name)
            .all()
        )
    
    def get_products_by_status(self, user_id: UUID, status: ProductStatus) -> List[Product]:
        """Get products by status"""
        return (
            self.db.query(Product)
            .filter(Product.user_id == user_id, Product.status == status)
            .order_by(Product.name)
            .all()
        )
    
    def search_products(self, user_id: UUID, query: str) -> List[Product]:
        """Search products by name or description"""
        return (
            self.db.query(Product)
            .filter(
                Product.user_id == user_id,
                (Product.name.ilike(f"%{query}%") | Product.description.ilike(f"%{query}%"))
            )
            .order_by(Product.name)
            .all()
        )
    
    def update_product_status(self, product_id: UUID, user_id: UUID, status: ProductStatus) -> Optional[Product]:
        """Update product status"""
        try:
            db_product = self.get_product(product_id, user_id)
            if not db_product:
                return None
            
            db_product.status = status
            self.db.commit()
            self.db.refresh(db_product)
            
            logger.info(f"Product status updated: {db_product.name} -> {status}")
            return db_product
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating product status: {e}")
            raise
    
    def get_product_stats(self, user_id: UUID) -> ProductStats:
        """Get product statistics"""
        try:
            # Count products by status
            status_counts = (
                self.db.query(Product.status, func.count(Product.id))
                .filter(Product.user_id == user_id)
                .group_by(Product.status)
                .all()
            )
            
            # Count products by category
            category_counts = (
                self.db.query(Product.category, func.count(Product.id))
                .filter(Product.user_id == user_id)
                .group_by(Product.category)
                .all()
            )
            
            # Get total count
            total_products = self.db.query(Product).filter(Product.user_id == user_id).count()
            
            # Build stats
            stats = {
                'total_products': total_products,
                'active_products': 0,
                'inactive_products': 0,
                'paused_products': 0,
                'categories': [{'name': cat, 'count': count} for cat, count in category_counts],
                'top_selling': []  # This would require order data
            }
            
            # Fill status counts
            for status, count in status_counts:
                if status == ProductStatus.ACTIVE:
                    stats['active_products'] = count
                elif status == ProductStatus.INACTIVE:
                    stats['inactive_products'] = count
                elif status == ProductStatus.PAUSED:
                    stats['paused_products'] = count
            
            return ProductStats(**stats)
            
        except Exception as e:
            logger.error(f"Error getting product stats: {e}")
            raise