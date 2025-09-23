from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from uuid import UUID
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerStats
import logging

logger = logging.getLogger(__name__)

class CustomerService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_customer(self, customer_data: CustomerCreate, user_id: UUID) -> Customer:
        """Create a new customer"""
        try:
            db_customer = Customer(
                user_id=user_id,
                name=customer_data.name,
                email=customer_data.email,
                phone=customer_data.phone,
                birth_date=customer_data.birth_date,
                address=customer_data.address,
                status=customer_data.status,
                preferences=customer_data.preferences,
                notes=customer_data.notes
            )
            
            self.db.add(db_customer)
            self.db.commit()
            self.db.refresh(db_customer)
            
            logger.info(f"Customer created: {db_customer.name}")
            return db_customer
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating customer: {e}")
            raise
    
    def get_customers(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Customer]:
        """Get customers for a user"""
        return (
            self.db.query(Customer)
            .filter(Customer.user_id == user_id)
            .order_by(desc(Customer.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_customer(self, customer_id: UUID, user_id: UUID) -> Optional[Customer]:
        """Get a specific customer"""
        return (
            self.db.query(Customer)
            .filter(Customer.id == customer_id, Customer.user_id == user_id)
            .first()
        )
    
    def get_customer_by_email(self, email: str, user_id: UUID) -> Optional[Customer]:
        """Get customer by email"""
        return (
            self.db.query(Customer)
            .filter(Customer.email == email, Customer.user_id == user_id)
            .first()
        )
    
    def update_customer(self, customer_id: UUID, user_id: UUID, customer_data: CustomerUpdate) -> Optional[Customer]:
        """Update a customer"""
        try:
            db_customer = self.get_customer(customer_id, user_id)
            if not db_customer:
                return None
            
            update_data = customer_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_customer, field, value)
            
            self.db.commit()
            self.db.refresh(db_customer)
            
            logger.info(f"Customer updated: {db_customer.name}")
            return db_customer
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating customer: {e}")
            raise
    
    def delete_customer(self, customer_id: UUID, user_id: UUID) -> bool:
        """Delete a customer"""
        try:
            db_customer = self.get_customer(customer_id, user_id)
            if not db_customer:
                return False
            
            self.db.delete(db_customer)
            self.db.commit()
            
            logger.info(f"Customer deleted: {customer_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting customer: {e}")
            raise
    
    def search_customers(self, user_id: UUID, query: str) -> List[Customer]:
        """Search customers by name, email, or phone"""
        return (
            self.db.query(Customer)
            .filter(
                Customer.user_id == user_id,
                (Customer.name.ilike(f"%{query}%") | 
                 Customer.email.ilike(f"%{query}%") |
                 Customer.phone.ilike(f"%{query}%"))
            )
            .order_by(Customer.name)
            .all()
        )
    
    def get_customers_by_status(self, user_id: UUID, status: str) -> List[Customer]:
        """Get customers by status"""
        return (
            self.db.query(Customer)
            .filter(Customer.user_id == user_id, Customer.status == status)
            .order_by(Customer.name)
            .all()
        )
    
    def update_customer_stats(self, customer_id: UUID, user_id: UUID, 
                            total_orders: int = None, total_spent: float = None,
                            favorite_marketplace: str = None) -> Optional[Customer]:
        """Update customer statistics"""
        try:
            db_customer = self.get_customer(customer_id, user_id)
            if not db_customer:
                return None
            
            if total_orders is not None:
                db_customer.total_orders = total_orders
            if total_spent is not None:
                db_customer.total_spent = total_spent
                db_customer.average_order_value = total_spent / total_orders if total_orders > 0 else 0
            if favorite_marketplace is not None:
                db_customer.favorite_marketplace = favorite_marketplace
            
            db_customer.last_order_date = func.now()
            
            self.db.commit()
            self.db.refresh(db_customer)
            
            logger.info(f"Customer stats updated: {db_customer.name}")
            return db_customer
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating customer stats: {e}")
            raise
    
    def get_customer_stats(self, user_id: UUID) -> CustomerStats:
        """Get customer statistics"""
        try:
            # Count customers by status
            status_counts = (
                self.db.query(Customer.status, func.count(Customer.id))
                .filter(Customer.user_id == user_id)
                .group_by(Customer.status)
                .all()
            )
            
            # Calculate averages
            totals = (
                self.db.query(
                    func.count(Customer.id).label('total_customers'),
                    func.coalesce(func.avg(Customer.average_order_value), 0).label('average_ticket')
                )
                .filter(Customer.user_id == user_id)
                .first()
            )
            
            # Get top customers
            top_customers = (
                self.db.query(Customer)
                .filter(Customer.user_id == user_id)
                .order_by(desc(Customer.total_spent))
                .limit(5)
                .all()
            )
            
            # Build stats
            stats = {
                'total_customers': totals.total_customers,
                'active_customers': 0,
                'inactive_customers': 0,
                'vip_customers': 0,
                'average_ticket': totals.average_ticket,
                'top_customers': [
                    {
                        'id': str(customer.id),
                        'name': customer.name,
                        'total_spent': float(customer.total_spent),
                        'total_orders': customer.total_orders
                    }
                    for customer in top_customers
                ]
            }
            
            # Fill status counts
            for status, count in status_counts:
                if status == 'active':
                    stats['active_customers'] = count
                elif status == 'inactive':
                    stats['inactive_customers'] = count
                elif status == 'vip':
                    stats['vip_customers'] = count
            
            return CustomerStats(**stats)
            
        except Exception as e:
            logger.error(f"Error getting customer stats: {e}")
            raise