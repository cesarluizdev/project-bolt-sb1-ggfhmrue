from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from uuid import UUID
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderCreate, OrderUpdate, OrderStats
import logging

logger = logging.getLogger(__name__)

class OrderService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_order(self, order_data: OrderCreate, user_id: UUID) -> Order:
        """Create a new order"""
        try:
            # Generate order number
            order_count = self.db.query(Order).filter(Order.user_id == user_id).count()
            order_number = f"ORD-{order_count + 1:06d}"
            
            # Calculate total from items
            total = sum(item.price * item.quantity for item in order_data.items)
            
            # Create order
            db_order = Order(
                order_number=order_number,
                user_id=user_id,
                marketplace=order_data.marketplace,
                marketplace_order_id=order_data.marketplace_order_id,
                total=total,
                delivery_fee=order_data.delivery_fee,
                payment_method=order_data.payment_method,
                customer_name=order_data.customer_name,
                customer_email=order_data.customer_email,
                customer_phone=order_data.customer_phone,
                delivery_address=order_data.delivery_address,
                restaurant_name=order_data.restaurant_name,
                restaurant_phone=order_data.restaurant_phone,
                estimated_delivery=order_data.estimated_delivery,
                notes=order_data.notes
            )
            
            self.db.add(db_order)
            self.db.flush()  # Get the order ID
            
            # Create order items
            for item_data in order_data.items:
                db_item = OrderItem(
                    order_id=db_order.id,
                    product_id=item_data.product_id,
                    name=item_data.name,
                    description=item_data.description,
                    quantity=item_data.quantity,
                    price=item_data.price,
                    observations=item_data.observations
                )
                self.db.add(db_item)
            
            self.db.commit()
            self.db.refresh(db_order)
            
            logger.info(f"Order created: {db_order.order_number}")
            return db_order
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating order: {e}")
            raise
    
    def get_orders(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Order]:
        """Get orders for a user"""
        return (
            self.db.query(Order)
            .filter(Order.user_id == user_id)
            .order_by(desc(Order.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_order(self, order_id: UUID, user_id: UUID) -> Optional[Order]:
        """Get a specific order"""
        return (
            self.db.query(Order)
            .filter(Order.id == order_id, Order.user_id == user_id)
            .first()
        )
    
    def update_order(self, order_id: UUID, user_id: UUID, order_data: OrderUpdate) -> Optional[Order]:
        """Update an order"""
        try:
            db_order = self.get_order(order_id, user_id)
            if not db_order:
                return None
            
            update_data = order_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_order, field, value)
            
            self.db.commit()
            self.db.refresh(db_order)
            
            logger.info(f"Order updated: {db_order.order_number}")
            return db_order
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating order: {e}")
            raise
    
    def update_order_status(self, order_id: UUID, user_id: UUID, status: OrderStatus) -> Optional[Order]:
        """Update order status"""
        try:
            db_order = self.get_order(order_id, user_id)
            if not db_order:
                return None
            
            db_order.status = status
            
            # Set delivered_at if status is delivered
            if status == OrderStatus.DELIVERED:
                db_order.delivered_at = func.now()
            
            self.db.commit()
            self.db.refresh(db_order)
            
            logger.info(f"Order status updated: {db_order.order_number} -> {status}")
            return db_order
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating order status: {e}")
            raise
    
    def delete_order(self, order_id: UUID, user_id: UUID) -> bool:
        """Delete an order"""
        try:
            db_order = self.get_order(order_id, user_id)
            if not db_order:
                return False
            
            self.db.delete(db_order)
            self.db.commit()
            
            logger.info(f"Order deleted: {order_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting order: {e}")
            raise
    
    def get_orders_by_status(self, user_id: UUID, status: OrderStatus) -> List[Order]:
        """Get orders by status"""
        return (
            self.db.query(Order)
            .filter(Order.user_id == user_id, Order.status == status)
            .order_by(desc(Order.created_at))
            .all()
        )
    
    def get_orders_by_marketplace(self, user_id: UUID, marketplace: str) -> List[Order]:
        """Get orders by marketplace"""
        return (
            self.db.query(Order)
            .filter(Order.user_id == user_id, Order.marketplace == marketplace)
            .order_by(desc(Order.created_at))
            .all()
        )
    
    def get_order_stats(self, user_id: UUID) -> OrderStats:
        """Get order statistics"""
        try:
            # Count orders by status
            status_counts = (
                self.db.query(Order.status, func.count(Order.id))
                .filter(Order.user_id == user_id)
                .group_by(Order.status)
                .all()
            )
            
            # Calculate totals
            totals = (
                self.db.query(
                    func.count(Order.id).label('total_orders'),
                    func.coalesce(func.sum(Order.total), 0).label('total_revenue')
                )
                .filter(Order.user_id == user_id)
                .first()
            )
            
            # Build stats
            stats = {
                'total_orders': totals.total_orders,
                'pending_orders': 0,
                'confirmed_orders': 0,
                'preparing_orders': 0,
                'shipped_orders': 0,
                'delivered_orders': 0,
                'cancelled_orders': 0,
                'total_revenue': totals.total_revenue,
                'average_order_value': totals.total_revenue / totals.total_orders if totals.total_orders > 0 else 0
            }
            
            # Fill status counts
            for status, count in status_counts:
                if status == OrderStatus.PENDING:
                    stats['pending_orders'] = count
                elif status == OrderStatus.CONFIRMED:
                    stats['confirmed_orders'] = count
                elif status == OrderStatus.PREPARING:
                    stats['preparing_orders'] = count
                elif status == OrderStatus.SHIPPED:
                    stats['shipped_orders'] = count
                elif status == OrderStatus.DELIVERED:
                    stats['delivered_orders'] = count
                elif status == OrderStatus.CANCELLED:
                    stats['cancelled_orders'] = count
            
            return OrderStats(**stats)
            
        except Exception as e:
            logger.error(f"Error getting order stats: {e}")
            raise