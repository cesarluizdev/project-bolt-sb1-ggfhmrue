from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.services.order_service import OrderService
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate, OrderStats
from app.models.order import OrderStatus, Marketplace
from app.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/orders", tags=["Orders"])

def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(db)

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Create a new order"""
    try:
        order = order_service.create_order(order_data, UUID(current_user["id"]))
        return order
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[OrderStatus] = None,
    marketplace: Optional[Marketplace] = None,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get orders for current user"""
    try:
        user_id = UUID(current_user["id"])
        
        if status:
            orders = order_service.get_orders_by_status(user_id, status)
        elif marketplace:
            orders = order_service.get_orders_by_marketplace(user_id, marketplace.value)
        else:
            orders = order_service.get_orders(user_id, skip, limit)
        
        return orders
    except Exception as e:
        logger.error(f"Error getting orders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve orders"
        )

@router.get("/stats", response_model=OrderStats)
async def get_order_stats(
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get order statistics"""
    try:
        stats = order_service.get_order_stats(UUID(current_user["id"]))
        return stats
    except Exception as e:
        logger.error(f"Error getting order stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve order statistics"
        )

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get a specific order"""
    try:
        order = order_service.get_order(order_id, UUID(current_user["id"]))
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting order: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve order"
        )

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: UUID,
    order_data: OrderUpdate,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Update an order"""
    try:
        order = order_service.update_order(order_id, UUID(current_user["id"]), order_data)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: UUID,
    status: OrderStatus,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Update order status"""
    try:
        order = order_service.update_order_status(order_id, UUID(current_user["id"]), status)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{order_id}")
async def delete_order(
    order_id: UUID,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Delete an order"""
    try:
        success = order_service.delete_order(order_id, UUID(current_user["id"]))
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return {"message": "Order deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting order: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete order"
        )

# Marketplace-specific endpoints
@router.get("/rappi/", response_model=List[OrderResponse])
async def get_rappi_orders(
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get Rappi orders"""
    return order_service.get_orders_by_marketplace(UUID(current_user["id"]), "Rappi")

@router.get("/Ifood/", response_model=List[OrderResponse])
async def get_Ifood_orders(
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get Ifood orders"""
    return order_service.get_orders_by_marketplace(UUID(current_user["id"]), "Ifood")

@router.get("/99food/", response_model=List[OrderResponse])
async def get_99food_orders(
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get 99Food orders"""
    return order_service.get_orders_by_marketplace(UUID(current_user["id"]), "99Food")