import httpx
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.Ifood_token import IfoodToken
from app.schemas.Ifood import IfoodTokenCreate, IfoodTokenUpdate, IfoodTokenRefreshResponse
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class IfoodService:
    """Serviço para integração com API do Ifood via OAuth2"""
    
    def __init__(self, db: Session):
        self.db = db
        self.client_id = settings.Ifood_client_id
        self.client_secret = settings.Ifood_client_secret
        self.base_url = settings.Ifood_base_url
        self.auth_url = f"{self.base_url}/oauth/authorize"
        self.token_url = f"{self.base_url}/oauth/token"
        
    def generate_authorization_url(self, merchant_id: str, redirect_uri: str) -> Dict[str, str]:
        """
        Gera URL de autorização OAuth2 para o Ifood
        
        Args:
            merchant_id: ID do merchant no Ifood
            redirect_uri: URI de callback após autorização
            
        Returns:
            Dict com authorization_url, state e merchant_id
        """
        try:
            # Gerar state único para segurança
            state = secrets.token_urlsafe(32)
            
            # Parâmetros da URL de autorização
            params = {
                "response_type": "code",
                "client_id": self.client_id,
                "redirect_uri": redirect_uri,
                "state": state,
                "scope": "orders:read orders:write menu:read menu:write"
            }
            
            # Construir URL
            param_string = "&".join([f"{k}={v}" for k, v in params.items()])
            authorization_url = f"{self.auth_url}?{param_string}"
            
            logger.info(f"Generated authorization URL for merchant {merchant_id}")
            
            return {
                "authorization_url": authorization_url,
                "state": state,
                "merchant_id": merchant_id
            }
            
        except Exception as e:
            logger.error(f"Error generating authorization URL: {e}")
            raise
    
    async def exchange_code_for_tokens(self, code: str, redirect_uri: str, merchant_id: str) -> Dict[str, Any]:
        """
        Troca o código de autorização por access_token e refresh_token
        
        Args:
            code: Código de autorização recebido do Ifood
            redirect_uri: URI de callback usada na autorização
            merchant_id: ID do merchant
            
        Returns:
            Dict com tokens e informações de expiração
        """
        try:
            logger.info(f"Exchanging authorization code for tokens - merchant: {merchant_id}")
            
            # Dados para troca do código
            token_data = {
                "grant_type": "authorization_code",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
                "redirect_uri": redirect_uri
            }
            
            # Fazer requisição para obter tokens
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.token_url,
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code != 200:
                    logger.error(f"Token exchange failed: {response.status_code} - {response.text}")
                    raise Exception(f"Failed to exchange code for tokens: {response.text}")
                
                token_response = response.json()
                
                # Calcular data de expiração
                expires_in = token_response.get("expires_in", 3600)  # Default 1 hora
                expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
                
                # Persistir tokens no banco
                await self.save_tokens(
                    merchant_id=merchant_id,
                    access_token=token_response["access_token"],
                    refresh_token=token_response["refresh_token"],
                    expires_at=expires_at
                )
                
                logger.info(f"Tokens successfully obtained and saved for merchant {merchant_id}")
                
                return {
                    "access_token": token_response["access_token"],
                    "refresh_token": token_response["refresh_token"],
                    "expires_in": expires_in,
                    "expires_at": expires_at,
                    "token_type": token_response.get("token_type", "Bearer")
                }
                
        except Exception as e:
            logger.error(f"Error exchanging code for tokens: {e}")
            raise
    
    async def save_tokens(self, merchant_id: str, access_token: str, refresh_token: str, expires_at: datetime):
        """
        Salva ou atualiza tokens no banco de forma idempotente
        
        Args:
            merchant_id: ID do merchant
            access_token: Token de acesso
            refresh_token: Token de renovação
            expires_at: Data de expiração
        """
        try:
            # Verificar se já existe token para este merchant
            existing_token = self.db.query(IfoodToken).filter(
                IfoodToken.merchant_id == merchant_id
            ).first()
            
            if existing_token:
                # Atualizar token existente
                existing_token.access_token = access_token
                existing_token.refresh_token = refresh_token
                existing_token.expires_at = expires_at
                existing_token.is_active = True
                existing_token.updated_at = datetime.utcnow()
                
                logger.info(f"Updated existing tokens for merchant {merchant_id}")
            else:
                # Criar novo registro
                new_token = IfoodToken(
                    merchant_id=merchant_id,
                    access_token=access_token,
                    refresh_token=refresh_token,
                    expires_at=expires_at,
                    is_active=True
                )
                self.db.add(new_token)
                
                logger.info(f"Created new token record for merchant {merchant_id}")
            
            self.db.commit()
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error saving tokens: {e}")
            raise
    
    async def get_valid_token(self, merchant_id: str) -> Optional[str]:
        """
        Busca token válido no banco, renovando se necessário
        
        Args:
            merchant_id: ID do merchant
            
        Returns:
            Access token válido ou None se não encontrado
        """
        try:
            # Buscar token no banco
            token_record = self.db.query(IfoodToken).filter(
                and_(
                    IfoodToken.merchant_id == merchant_id,
                    IfoodToken.is_active == True
                )
            ).first()
            
            if not token_record:
                logger.warning(f"No active token found for merchant {merchant_id}")
                return None
            
            # Verificar se token está próximo do vencimento (renovar se faltam menos de 10 minutos)
            now = datetime.utcnow()
            time_until_expiry = token_record.expires_at - now
            
            if time_until_expiry.total_seconds() < 600:  # 10 minutos
                logger.info(f"Token expiring soon for merchant {merchant_id}, refreshing...")
                
                # Renovar token
                new_tokens = await self.refresh_token(merchant_id, token_record.refresh_token)
                if new_tokens:
                    return new_tokens["access_token"]
                else:
                    logger.error(f"Failed to refresh token for merchant {merchant_id}")
                    return None
            
            logger.info(f"Retrieved valid token for merchant {merchant_id}")
            return token_record.access_token
            
        except Exception as e:
            logger.error(f"Error getting valid token: {e}")
            return None
    
    async def refresh_token(self, merchant_id: str, refresh_token: str) -> Optional[Dict[str, Any]]:
        """
        Renova access_token usando refresh_token
        
        Args:
            merchant_id: ID do merchant
            refresh_token: Token de renovação
            
        Returns:
            Dict com novos tokens ou None se falhou
        """
        try:
            logger.info(f"Refreshing token for merchant {merchant_id}")
            
            # Dados para renovação
            refresh_data = {
                "grant_type": "refresh_token",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": refresh_token
            }
            
            # Fazer requisição para renovar token
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.token_url,
                    data=refresh_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code != 200:
                    logger.error(f"Token refresh failed: {response.status_code} - {response.text}")
                    return None
                
                token_response = response.json()
                
                # Calcular nova data de expiração
                expires_in = token_response.get("expires_in", 3600)
                expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
                
                # Salvar novos tokens
                await self.save_tokens(
                    merchant_id=merchant_id,
                    access_token=token_response["access_token"],
                    refresh_token=token_response.get("refresh_token", refresh_token),  # Alguns providers não retornam novo refresh_token
                    expires_at=expires_at
                )
                
                logger.info(f"Token successfully refreshed for merchant {merchant_id}")
                
                return {
                    "access_token": token_response["access_token"],
                    "refresh_token": token_response.get("refresh_token", refresh_token),
                    "expires_in": expires_in,
                    "expires_at": expires_at,
                    "token_type": token_response.get("token_type", "Bearer")
                }
                
        except Exception as e:
            logger.error(f"Error refreshing token: {e}")
            return None
    
    async def make_authenticated_request(self, merchant_id: str, method: str, endpoint: str, **kwargs) -> Optional[Dict[str, Any]]:
        """
        Faz requisição autenticada à API do Ifood
        
        Args:
            merchant_id: ID do merchant
            method: Método HTTP (GET, POST, etc.)
            endpoint: Endpoint da API (ex: /orders)
            **kwargs: Argumentos adicionais para httpx
            
        Returns:
            Resposta da API ou None se falhou
        """
        try:
            # Obter token válido
            access_token = await self.get_valid_token(merchant_id)
            if not access_token:
                logger.error(f"No valid token available for merchant {merchant_id}")
                return None
            
            # Preparar headers
            headers = kwargs.get("headers", {})
            headers["Authorization"] = f"Bearer {access_token}"
            headers["Content-Type"] = "application/json"
            kwargs["headers"] = headers
            
            # Fazer requisição
            url = f"{self.base_url}{endpoint}"
            
            async with httpx.AsyncClient() as client:
                response = await client.request(method, url, **kwargs)
                
                if response.status_code == 401:
                    logger.warning(f"Token expired for merchant {merchant_id}, attempting refresh...")
                    
                    # Tentar renovar token e fazer nova requisição
                    token_record = self.db.query(IfoodToken).filter(
                        IfoodToken.merchant_id == merchant_id
                    ).first()
                    
                    if token_record:
                        new_tokens = await self.refresh_token(merchant_id, token_record.refresh_token)
                        if new_tokens:
                            headers["Authorization"] = f"Bearer {new_tokens['access_token']}"
                            response = await client.request(method, url, **kwargs)
                
                if response.status_code >= 400:
                    logger.error(f"API request failed: {response.status_code} - {response.text}")
                    return None
                
                logger.info(f"Successful API request to {endpoint} for merchant {merchant_id}")
                return response.json()
                
        except Exception as e:
            logger.error(f"Error making authenticated request: {e}")
            return None
    
    async def get_orders(self, merchant_id: str, **filters) -> Optional[Dict[str, Any]]:
        """
        Busca pedidos do Ifood para um merchant
        
        Args:
            merchant_id: ID do merchant
            **filters: Filtros para a busca (status, date_range, etc.)
            
        Returns:
            Lista de pedidos ou None se falhou
        """
        try:
            logger.info(f"Fetching orders for merchant {merchant_id}")
            
            # Construir parâmetros de query
            params = {}
            if filters:
                params.update(filters)
            
            # Fazer requisição
            response = await self.make_authenticated_request(
                merchant_id=merchant_id,
                method="GET",
                endpoint="/orders",
                params=params
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error fetching orders: {e}")
            return None
    
    async def get_menu(self, merchant_id: str) -> Optional[Dict[str, Any]]:
        """
        Busca cardápio do merchant no Ifood
        
        Args:
            merchant_id: ID do merchant
            
        Returns:
            Dados do cardápio ou None se falhou
        """
        try:
            logger.info(f"Fetching menu for merchant {merchant_id}")
            
            response = await self.make_authenticated_request(
                merchant_id=merchant_id,
                method="GET",
                endpoint="/menu"
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error fetching menu: {e}")
            return None
    
    def revoke_token(self, merchant_id: str) -> bool:
        """
        Revoga token de um merchant (marca como inativo)
        
        Args:
            merchant_id: ID do merchant
            
        Returns:
            True se sucesso, False caso contrário
        """
        try:
            token_record = self.db.query(IfoodToken).filter(
                IfoodToken.merchant_id == merchant_id
            ).first()
            
            if token_record:
                token_record.is_active = False
                token_record.updated_at = datetime.utcnow()
                self.db.commit()
                
                logger.info(f"Token revoked for merchant {merchant_id}")
                return True
            
            logger.warning(f"No token found to revoke for merchant {merchant_id}")
            return False
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error revoking token: {e}")
            return False