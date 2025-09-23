import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Database Configuration
    database_url: str = os.getenv("DATABASE_URL", "")
    
    # API Configuration
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # JWT Configuration
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # CORS Configuration
    allowed_origins: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Ifood Integration
    Ifood_client_id: str = os.getenv("Ifood_CLIENT_ID", "")
    Ifood_client_secret: str = os.getenv("Ifood_CLIENT_SECRET", "")
    Ifood_base_url: str = os.getenv("Ifood_BASE_URL", "https://merchant-api.Ifood.com.br")
    
    # App Configuration
    app_name: str = "Zentro Solution API"
    app_version: str = "1.0.0"
    app_description: str = "API para sistema de monitoramento de pedidos de delivery"

    class Config:
        env_file = ".env"

settings = Settings()