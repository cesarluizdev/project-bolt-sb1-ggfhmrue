#!/usr/bin/env python3
"""
Zentro Solution API - Development Server
Run this script to start the development server
"""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print("🚀 Starting Zentro Solution API")
    print(f"📊 Environment: {'Development' if settings.debug else 'Production'}")
    print(f"🌐 Server: http://{settings.api_host}:{settings.api_port}")
    print(f"📚 Docs: http://{settings.api_host}:{settings.api_port}/docs")
    print(f"❤️  Health: http://{settings.api_host}:{settings.api_port}/health")
    print("-" * 50)
    
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
        access_log=True
    )