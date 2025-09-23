from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from supabase import Client
from app.config import settings
from app.schemas.auth import TokenData
import logging

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return self.pwd_context.hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.jwt_access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[TokenData]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            email: str = payload.get("sub")
            user_id: str = payload.get("user_id")
            
            if email is None:
                return None
                
            token_data = TokenData(email=email, user_id=user_id)
            return token_data
        except JWTError as e:
            logger.error(f"JWT verification error: {e}")
            return None
    
    async def authenticate_user(self, email: str, password: str):
        """Authenticate user with Supabase"""
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if response.user:
                return response
            return None
            
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None
    
    async def register_user(self, email: str, password: str, full_name: str):
        """Register new user with Supabase"""
        try:
            response = self.supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "full_name": full_name
                    }
                }
            })
            
            return response
            
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return None
    
    async def get_current_user(self, token: str):
        """Get current user from token"""
        try:
            response = self.supabase.auth.get_user(token)
            return response.user if response else None
        except Exception as e:
            logger.error(f"Get user error: {e}")
            return None
    
    async def refresh_token(self, refresh_token: str):
        """Refresh access token"""
        try:
            response = self.supabase.auth.refresh_session(refresh_token)
            return response
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            return None
    
    async def sign_out(self, token: str):
        """Sign out user"""
        try:
            response = self.supabase.auth.sign_out(token)
            return response
        except Exception as e:
            logger.error(f"Sign out error: {e}")
            return None