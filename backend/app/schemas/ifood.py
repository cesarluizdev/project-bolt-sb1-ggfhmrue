from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class IfoodTokenBase(BaseModel):
    merchant_id: str
    access_token: str
    refresh_token: str
    expires_at: datetime

class IfoodTokenCreate(IfoodTokenBase):
    pass

class IfoodTokenUpdate(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None

class IfoodTokenResponse(IfoodTokenBase):
    expires_in: int
    token_type: str
    merchant_id: str

class IfoodBindingRequest(BaseModel):
    merchant_id: str

class IfoodBindingResponse(BaseModel):
    binding_code: str
    code_verifier: str
    portal_url: str
    instructions: str
    merchant_id: str

class IfoodAuthCodeRequest(BaseModel):
    authorization_code: str
    code_verifier: str
    merchant_id: str

class IfoodAuthStatusResponse(BaseModel):
    merchant_id: str
    authenticated: bool
    token_valid: bool
    expires_at: Optional[str] = None
    expires_in_seconds: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    message: str
