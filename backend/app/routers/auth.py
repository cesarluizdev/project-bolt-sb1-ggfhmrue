from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db, get_supabase
from app.services.auth_service import AuthService
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserResponse
from supabase import Client
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

def get_auth_service(supabase: Client = Depends(get_supabase)) -> AuthService:
    return AuthService(supabase)

@router.post("/register", response_model=dict)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user"""
    try:
        response = await auth_service.register_user(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name
        )
        
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
        
        return {
            "message": "User registered successfully",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "full_name": response.user.user_metadata.get("full_name")
            }
        }
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(
    email: str,
    password: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login user"""
    try:
        response = await auth_service.authenticate_user(email, password)
        
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        return Token(
            access_token=response.session.access_token,
            token_type="bearer",
            expires_in=response.session.expires_in,
            user={
                "id": response.user.id,
                "email": response.user.email,
                "full_name": response.user.user_metadata.get("full_name"),
                "avatar_url": response.user.user_metadata.get("avatar_url")
            }
        )
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

@router.post("/refresh")
async def refresh_token(
    refresh_token: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Refresh access token"""
    try:
        response = await auth_service.refresh_token(refresh_token)
        
        if not response or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "expires_in": response.session.expires_in
        }
        
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Logout user"""
    try:
        await auth_service.sign_out(credentials.credentials)
        return {"message": "Logged out successfully"}
        
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return {"message": "Logged out successfully"}  # Always return success

@router.get("/me")
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current user information"""
    try:
        user = await auth_service.get_current_user(credentials.credentials)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name"),
            "avatar_url": user.user_metadata.get("avatar_url"),
            "phone": user.user_metadata.get("phone"),
            "created_at": user.created_at
        }
        
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )