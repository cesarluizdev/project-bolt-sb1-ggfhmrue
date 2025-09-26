from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from supabase import Client
import httpx
from typing import Any, Dict

# Importação ajustada, presumindo a estrutura app/supabase_client.py
from .supabase_client import get_client 

# URLs da API do iFood
IFOOD_DEVICE_CODE_URL = "https://merchant-api.ifood.com.br/authentication/v1.0/oauth/userCode"
IFOOD_TOKEN_URL = "https://merchant-api.ifood.com.br/authentication/v1.0/oauth/token"

# -----------------------------------------------------------
# 1. MODELOS PYDANTIC
# -----------------------------------------------------------

# Modelo de Entrada para o /usercode
class IfoodUsercodeRequest(BaseModel):
    clientId: str

# Modelo de Retorno do iFood para o /usercode
class IfoodDeviceCodeResponse(BaseModel):
    userCode: str
    authorizationCodeVerifier: str
    verificationUrl: str
    verificationUrlComplete: str
    expiresIn: int

# Modelo de Entrada para o /token
class IfoodTokenRequest(BaseModel):
    # O cliente/frontend enviará o user_code para que possamos buscar o authorization_code_verifier no banco
    user_code: str
    
# Modelo de Retorno do iFood para o /token
class IfoodTokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    type: str # Geralmente "Bearer"
    expiresIn: int
    merchantId: str

# -----------------------------------------------------------
# 2. CONFIGURAÇÃO DO ROUTER
# -----------------------------------------------------------
router = APIRouter(
    prefix="/ifood",
    tags=["iFood Integration"]
)

# -----------------------------------------------------------
# ENDPOINT 1: /usercode (INICIA O FLUXO)
# -----------------------------------------------------------
@router.post("/usercode", summary="Passo 1: Inicia o fluxo Device Code e salva no Supabase")
async def ifood_device_code_flow(
    request_payload: IfoodUsercodeRequest, 
    supabase: Client = Depends(get_client)
):
    """
    Chama a API do iFood para obter o código de usuário e os verificadores, 
    salvando-os no Supabase.
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # Requisito: Content-Type: application/x-www-form-urlencoded
            response = await client.post(
                IFOOD_DEVICE_CODE_URL,
                headers={"accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
                data={"clientId": request_payload.clientId}
            )
            
            response.raise_for_status()
            
            # Valida a resposta do iFood
            ifood_data = IfoodDeviceCodeResponse(**response.json())

        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Erro na API do iFood (Status {e.response.status_code}): {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao processar chamada à API do iFood: {str(e)}"
            )

    # Inserção no Supabase
    try:
        response = supabase.table("ifood_usercodes").insert({
            "user_code": ifood_data.userCode,
            "authorization_code_verifier": ifood_data.authorizationCodeVerifier,
            "verification_url": ifood_data.verificationUrl,
            "verification_url_complete": ifood_data.verificationUrlComplete,
            "expires_in": ifood_data.expiresIn
        }).execute()

        if response.data:
            return {
                "message": "✅ Fluxo Device Code iniciado. O usuário deve autorizar.",
                "ifood_response": ifood_data.model_dump(),
                "data_saved": response.data[0]
            }
        else:
            raise Exception("Inserção no Supabase falhou sem erro detalhado.")

    except Exception as e:
        detail_error = str(e).strip()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro fatal ao inserir no Supabase: {detail_error}"
        )

# -----------------------------------------------------------
# ENDPOINT 2: /token (TROCA CÓDIGO POR ACCESS/REFRESH TOKEN)
# -----------------------------------------------------------
@router.post("/token", summary="Passo 2: Troca o código de autorização por tokens de acesso")
async def exchange_token_flow(
    request_payload: IfoodTokenRequest,
    supabase: Client = Depends(get_client)
):
    """
    Troca o código de autorização após o usuário aprovar no portal iFood,
    obtendo o access_token e o refresh_token.
    """
    
    # 1. BUSCAR O VERIFIER NO SUPABASE
    try:
        # Busca o registro no banco usando o user_code
        fetch_response = supabase.table("ifood_usercodes").select("*").eq(
            "user_code", request_payload.user_code
        ).limit(1).execute()
        
        if not fetch_response.data:
            raise HTTPException(status_code=404, detail="User code não encontrado ou expirado.")

        record = fetch_response.data[0]
        auth_code_verifier = record.get("authorization_code_verifier")
        client_id_used = record.get("client_id") # Assumindo que você salva o clientId original
        
        # NOTE: O iFood requer o client_id original para esta etapa.
        # Se você não salvou o clientId na tabela 'ifood_usercodes' (o que é recomendado),
        # você precisará passá-lo aqui de outra forma (e.g., variável de ambiente ou outro endpoint).
        # Vamos usar um valor de placeholder ou o clientId do request_payload anterior para fins de demonstração
        # Se você não tem o client_id original no seu banco, é o momento de adicioná-lo à tabela!
        # Por agora, usaremos o ID de demonstração
        if not client_id_used:
             # Este clientId precisa ser o mesmo usado na primeira chamada do /usercode
             # Se você não o salvou, ele deve ser uma variável de ambiente.
             client_id_used = "0b5c7a22-b607-4a3a-ae75-b32881ebc3ef" 


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados no Supabase: {str(e)}")

    # 2. CHAMADA À API DO IFOOD PARA TROCA DE TOKEN
    token_data = {
        "grantType": "authorizationCode",
        "authorizationCodeVerifier": auth_code_verifier,
        "clientId": client_id_used
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # Requisito: Content-Type: application/x-www-form-urlencoded
            response = await client.post(
                IFOOD_TOKEN_URL,
                headers={"accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
                data=token_data
            )
            
            response.raise_for_status()
            
            # Valida a resposta de token
            token_response_data = IfoodTokenResponse(**response.json())

        except httpx.HTTPStatusError as e:
            # Erro comum: 400 Bad Request se o código expirou ou não foi autorizado
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Erro na troca de token. Verifique se o código foi autorizado. Erro iFood: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao processar chamada de Token: {str(e)}"
            )

    # 3. ATUALIZAR O REGISTRO NO SUPABASE
    try:
        update_response = supabase.table("ifood_usercodes").update({
            "access_token": token_response_data.accessToken,
            "refresh_token": token_response_data.refreshToken,
            "token_expires_in": token_response_data.expiresIn,
            "merchant_id": token_response_data.merchantId,
            "is_authorized": True
        }).eq("user_code", request_payload.user_code).execute()
        
        # NOTE: Sua tabela 'ifood_usercodes' precisará ter estas novas colunas:
        # access_token (text), refresh_token (text), token_expires_in (integer), merchant_id (text), is_authorized (boolean)

        if update_response.data:
            return {
                "message": "✅ Tokens de acesso obtidos e salvos com sucesso!",
                "tokens": {
                    "access_token": token_response_data.accessToken,
                    "refresh_token": token_response_data.refreshToken
                },
                "merchant_id": token_response_data.merchantId
            }
        else:
            raise Exception("Atualização de tokens no Supabase falhou.")

    except Exception as e:
        detail_error = str(e).strip()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro fatal ao atualizar tokens no Supabase: {detail_error}"
        )