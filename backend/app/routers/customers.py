from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.services.customer_service import CustomerService
from app.schemas.customer import CustomerCreate, CustomerResponse, CustomerUpdate, CustomerStats
from app.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/customers", tags=["Customers"])

def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    return CustomerService(db)

@router.post("/", response_model=CustomerResponse)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Create a new customer"""
    try:
        customer = customer_service.create_customer(customer_data, UUID(current_user["id"]))
        return customer
    except Exception as e:
        logger.error(f"Error creating customer: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[CustomerResponse])
async def get_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Get customers for current user"""
    try:
        user_id = UUID(current_user["id"])
        
        if search:
            customers = customer_service.search_customers(user_id, search)
        elif status:
            customers = customer_service.get_customers_by_status(user_id, status)
        else:
            customers = customer_service.get_customers(user_id, skip, limit)
        
        return customers
    except Exception as e:
        logger.error(f"Error getting customers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve customers"
        )

@router.get("/stats", response_model=CustomerStats)
async def get_customer_stats(
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Get customer statistics"""
    try:
        stats = customer_service.get_customer_stats(UUID(current_user["id"]))
        return stats
    except Exception as e:
        logger.error(f"Error getting customer stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve customer statistics"
        )

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: UUID,
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Get a specific customer"""
    try:
        customer = customer_service.get_customer(customer_id, UUID(current_user["id"]))
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        return customer
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting customer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve customer"
        )

@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: UUID,
    customer_data: CustomerUpdate,
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Update a customer"""
    try:
        customer = customer_service.update_customer(customer_id, UUID(current_user["id"]), customer_data)
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        return customer
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating customer: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: UUID,
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Delete a customer"""
    try:
        success = customer_service.delete_customer(customer_id, UUID(current_user["id"]))
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        return {"message": "Customer deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting customer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete customer"
        )

@router.get("/email/{email}", response_model=CustomerResponse)
async def get_customer_by_email(
    email: str,
    current_user: dict = Depends(get_current_user),
    customer_service: CustomerService = Depends(get_customer_service)
):
    """Get customer by email"""
    try:
        customer = customer_service.get_customer_by_email(email, UUID(current_user["id"]))
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        return customer
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting customer by email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve customer"
        )