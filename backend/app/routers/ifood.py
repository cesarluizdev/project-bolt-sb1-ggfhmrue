from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.services.Ifood_distributed_service import IfoodDistributedAuthService
from app.schemas.Ifood import (
    IfoodBindingRequest,
    IfoodBindingResponse,
    IfoodAuthCodeRequest,
    IfoodTokenResponse,
    IfoodAuthStatusResponse
)
from app.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/Ifood", tags=["Ifood Integration"])

def get_Ifood_service(db: Session = Depends(get_db)) -> IfoodDistributedAuthService:
    return IfoodDistributedAuthService(db)

@router.post("/auth/binding", response_model=IfoodBindingResponse)
async def get_binding_code(
    binding_request: IfoodBindingRequest,
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    PASSO 1: Obter código de vínculo do Ifood
    
    Gera o código que o lojista deve inserir no Portal do Parceiro
    para autorizar a aplicação
    
    Args:
        binding_request: Dados da requisição (merchant_id)
        
    Returns:
        Código de vínculo e instruções para o lojista
    """
    try:
        logger.info(f"🔗 Iniciando processo de vínculo para merchant {binding_request.merchant_id}")
        
        # Obter código de vínculo
        binding_data = await Ifood_service.get_binding_code(binding_request.merchant_id)
        
        return IfoodBindingResponse(
            binding_code=binding_data["binding_code"],
            code_verifier=binding_data["code_verifier"],
            portal_url=binding_data["portal_url"],
            instructions=binding_data["instructions"],
            merchant_id=binding_request.merchant_id
        )
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter código de vínculo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao obter código de vínculo: {str(e)}"
        )

@router.post("/auth/authorize", response_model=IfoodTokenResponse)
async def exchange_authorization_code(
    auth_request: IfoodAuthCodeRequest,
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    PASSO 2: Trocar código de autorização por tokens
    
    Após o lojista autorizar no Portal do Parceiro, este endpoint
    troca o código de autorização por access_token e refresh_token
    
    Args:
        auth_request: Código de autorização e dados do merchant
        
    Returns:
        Tokens de acesso e informações de expiração
    """
    try:
        logger.info(f"🔄 Processando código de autorização para merchant {auth_request.merchant_id}")
        
        # Trocar código por tokens
        tokens = await Ifood_service.exchange_authorization_code(
            authorization_code=auth_request.authorization_code,
            code_verifier=auth_request.code_verifier,
            merchant_id=auth_request.merchant_id
        )
        
        return IfoodTokenResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            expires_in=tokens["expires_in"],
            expires_at=tokens["expires_at"],
            token_type=tokens["token_type"],
            merchant_id=tokens["merchant_id"]
        )
        
    except Exception as e:
        logger.error(f"❌ Erro ao processar código de autorização: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Falha ao processar autorização: {str(e)}"
        )

@router.get("/auth/status/{merchant_id}", response_model=IfoodAuthStatusResponse)
async def get_auth_status(
    merchant_id: str,
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    Verifica status da autenticação para um merchant
    
    Args:
        merchant_id: ID do merchant
        
    Returns:
        Status da autenticação e validade do token
    """
    try:
        logger.info(f"🔍 Verificando status de autenticação para merchant {merchant_id}")
        
        # Obter status detalhado
        status_info = Ifood_service.get_auth_status(merchant_id)
        
        return IfoodAuthStatusResponse(**status_info)
            
    except Exception as e:
        logger.error(f"❌ Erro ao verificar status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao verificar status: {str(e)}"
        )

@router.post("/auth/refresh/{merchant_id}")
async def refresh_token(
    merchant_id: str,
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    Força renovação do token para um merchant
    
    Args:
        merchant_id: ID do merchant
        
    Returns:
        Confirmação da renovação do token
    """
    try:
        logger.info(f"🔄 Forçando renovação de token para merchant {merchant_id}")
        
        # Buscar token atual
        from app.models.Ifood_token import IfoodToken
        token_record = Ifood_service.db.query(IfoodToken).filter(
            IfoodToken.merchant_id == merchant_id
        ).first()
        
        if not token_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nenhum token encontrado para este merchant"
            )
        
        # Renovar token
        new_tokens = await Ifood_service.refresh_access_token(
            merchant_id=merchant_id,
            refresh_token=token_record.refresh_token
        )
        
        if new_tokens:
            return {
                "message": "Token renovado com sucesso",
                "merchant_id": merchant_id,
                "expires_at": new_tokens["expires_at"],
                "token_type": new_tokens["token_type"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Falha ao renovar token"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao renovar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao renovar token: {str(e)}"
        )

@router.delete("/auth/revoke/{merchant_id}")
async def revoke_authorization(
    merchant_id: str,
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    Revoga autorização para um merchant
    
    Args:
        merchant_id: ID do merchant
        
    Returns:
        Confirmação da revogação
    """
    try:
        logger.info(f"🚫 Revogando autorização para merchant {merchant_id}")
        
        success = await Ifood_service.revoke_authorization(merchant_id)
        
        if success:
            return {
                "message": "Autorização revogada com sucesso",
                "merchant_id": merchant_id
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nenhuma autorização encontrada para este merchant"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao revogar autorização: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao revogar autorização: {str(e)}"
        )

@router.get("/orders/{merchant_id}")
async def get_Ifood_orders(
    merchant_id: str,
    status: Optional[str] = Query(None, description="Filter by order status"),
    limit: Optional[int] = Query(50, description="Number of orders to return"),
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    Busca pedidos do Ifood para um merchant
    
    Args:
        merchant_id: ID do merchant
        status: Filtro por status do pedido
        limit: Número máximo de pedidos
        
    Returns:
        Lista de pedidos do Ifood
    """
    try:
        logger.info(f"📦 Buscando pedidos do Ifood para merchant {merchant_id}")
        
        # Preparar filtros
        filters = {}
        if status:
            filters["status"] = status
        if limit:
            filters["limit"] = limit
        
        # Buscar pedidos
        orders = await Ifood_service.get_orders(merchant_id, **filters)
        
        if orders is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Falha ao buscar pedidos da API do Ifood"
            )
        
        return {
            "merchant_id": merchant_id,
            "orders": orders,
            "total": len(orders.get("orders", [])) if isinstance(orders, dict) else 0,
            "message": "Pedidos obtidos com sucesso"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar pedidos do Ifood: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao buscar pedidos: {str(e)}"
        )

@router.get("/menu/{merchant_id}")
async def get_Ifood_menu(
    merchant_id: str,
    current_user: dict = Depends(get_current_user),
    Ifood_service: IfoodDistributedAuthService = Depends(get_Ifood_service)
):
    """
    Busca cardápio do merchant no Ifood
    
    Args:
        merchant_id: ID do merchant
        
    Returns:
        Dados do cardápio do Ifood
    """
    try:
        logger.info(f"🍽️  Buscando cardápio do Ifood para merchant {merchant_id}")
        
        # Buscar cardápio
        menu = await Ifood_service.get_menu(merchant_id)
        
        if menu is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Falha ao buscar cardápio da API do Ifood"
            )
        
        return {
            "merchant_id": merchant_id,
            "menu": menu,
            "message": "Cardápio obtido com sucesso"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao buscar cardápio do Ifood: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao buscar cardápio: {str(e)}"
        )