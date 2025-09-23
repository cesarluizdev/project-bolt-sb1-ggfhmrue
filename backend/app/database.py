from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from supabase import create_client, Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# SQLAlchemy setup
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.debug
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Supabase client setup
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key
)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase