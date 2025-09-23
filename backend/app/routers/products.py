from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.services.product_service import ProductService
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate, ProductStats
from app.models.product import ProductStatus
from app.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/products", tags=["Products"])

def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Create a new product"""
    try:
        product = product_service.create_product(product_data, UUID(current_user["id"]))
        return product
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    status: Optional[ProductStatus] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Get products for current user"""
    try:
        user_id = UUID(current_user["id"])
        
        if search:
            products = product_service.search_products(user_id, search)
        elif category:
            products = product_service.get_products_by_category(user_id, category)
        elif status:
            products = product_service.get_products_by_status(user_id, status)
        else:
            products = product_service.get_products(user_id, skip, limit)
        
        return products
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve products"
        )

@router.get("/stats", response_model=ProductStats)
async def get_product_stats(
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Get product statistics"""
    try:
        stats = product_service.get_product_stats(UUID(current_user["id"]))
        return stats
    except Exception as e:
        logger.error(f"Error getting product stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve product statistics"
        )

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Get a specific product"""
    try:
        product = product_service.get_product(product_id, UUID(current_user["id"]))
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve product"
        )

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Update a product"""
    try:
        product = product_service.update_product(product_id, UUID(current_user["id"]), product_data)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.patch("/{product_id}/status", response_model=ProductResponse)
async def update_product_status(
    product_id: UUID,
    status: ProductStatus,
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Update product status"""
    try:
        product = product_service.update_product_status(product_id, UUID(current_user["id"]), status)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product status: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{product_id}")
async def delete_product(
    product_id: UUID,
    current_user: dict = Depends(get_current_user),
    product_service: ProductService = Depends(get_product_service)
):
    """Delete a product"""
    try:
        success = product_service.delete_product(product_id, UUID(current_user["id"]))
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete product"
        )