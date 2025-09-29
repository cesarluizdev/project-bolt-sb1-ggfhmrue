from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from pydantic import BaseModel
from supabase import Client
import httpx
from typing import Any, Dict, List
from datetime import datetime, timedelta, timezone

# Importação do cliente Supabase.
from .supabase_client import get_client 

# URLs da API do iFood
IFOOD_DEVICE_CODE_URL = "https://merchant-api.ifood.com.br/authentication/v1.0/oauth/userCode"
IFOOD_TOKEN_URL = "https://merchant-api.ifood.com.br/authentication/v1.0/oauth/token"
IFOOD_MERCHANT_BASE_URL = "https://merchant-api.ifood.com.br/merchant/v1.0"
IFOOD_ORDER_BASE_URL = f"{IFOOD_MERCHANT_BASE_URL}/orders/v1.0" # Nova URL Base para Pedidos
IFOOD_MENU_URL_SUFFIX = "/merchants/v1/menus" # URL de exemplo para o menu

# IDs FIXOS da sua aplicação
IFOOD_CLIENT_ID = "0b5c7a22-b607-4a3a-ae75-b32881ebc3ef" 
PLATFORM_NAME = "ifood" 

# UUID de teste fornecido pelo usuário, que DEVE existir na tabela 'restaurantes'
TESTE_RESTAURANTE_UUID = "27f6bb79-e566-4534-8c88-b2e3d3f32ff5" 

# -----------------------------------------------------------
# 1. MODELOS PYDANTIC
# -----------------------------------------------------------

class IfoodUsercodeRequest(BaseModel):
    clientId: str

class IfoodTokenRequest(BaseModel):
    user_code: str
    
class IntegrationIdentifierRequest(BaseModel):
    # UUID do seu restaurante mestre
    restaurante_id: str = Query(..., description=f"ID Mestre (UUID) do restaurante. Ex: {TESTE_RESTAURANTE_UUID}") 
    plataforma: str = Query(PLATFORM_NAME, description="Plataforma de integração (ex: ifood)")

class IfoodMerchantStatusResponse(BaseModel):
    status: str 

# Novo modelo para demonstrar a resposta da API de Menu (Simplificado)
class IfoodMenuItem(BaseModel):
    itemId: str
    name: str
    price: float
    status: str
    
class IfoodMenuResponse(BaseModel):
    merchantId: str
    categories: List[str]
    items: List[IfoodMenuItem]
    

class IfoodWebhookPayload(BaseModel):
    id: str # ID do evento, que no caso de ORDER_PLACED será o ID do pedido
    code: str 
    correlationId: str
    metadata: Dict[str, Any]

# ... outros modelos (IfoodTokenResponse, IfoodDeviceCodeResponse) omitidos por brevidade
class IfoodDeviceCodeResponse(BaseModel):
    userCode: str
    authorizationCodeVerifier: str
    verificationUrl: str
    verificationUrlComplete: str
    expiresIn: int

class IfoodTokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    type: str 
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
# 3. FUNÇÕES AUXILIARES DE TOKEN E BUSCA
# -----------------------------------------------------------

async def _call_token_api(data: Dict[str, str], grant_type: str) -> IfoodTokenResponse:
    """Função centralizada para fazer chamadas ao endpoint /oauth/token (Troca/Renovação)."""
    data["clientId"] = IFOOD_CLIENT_ID
    data["grantType"] = grant_type
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            IFOOD_TOKEN_URL,
            headers={"accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
            data=data
        )
        response.raise_for_status()
        return IfoodTokenResponse(**response.json())

async def get_valid_integration_record(
    restaurante_id: str, 
    plataforma: str,
    supabase: Client
) -> Dict[str, Any]:
    """
    Busca o registro de integração (restaurante_integracoes), checa a validade e renova se necessário.
    Retorna o registro (com tokens atualizados) ou falha.
    """
    
    # 1. BUSCAR REGISTRO
    fetch_response = supabase.table("restaurante_integracoes").select("*").eq(
        "restaurante_id", restaurante_id
    ).eq("plataforma", plataforma).limit(1).execute()
    
    if not fetch_response.data:
        raise HTTPException(status_code=404, detail=f"Integração com {plataforma} não encontrada para o restaurante ID.")

    record = fetch_response.data[0]
    access_token = record.get("access_token")
    refresh_token = record.get("refresh_token")
    created_at_iso = record.get("created_at") 
    
    if not record.get("is_authorized") or not access_token or not refresh_token:
        raise HTTPException(status_code=401, detail="Integração não autorizada ou tokens ausentes. Reautorização necessária.")

    # 2. CHECAR EXPIRAÇÃO
    try:
        # Pega a data da última atualização do token.
        token_created_time = datetime.fromisoformat(created_at_iso.replace('Z', '+00:00'))
    except ValueError:
         token_created_time = datetime.now(timezone.utc) 
        
    expires_in_seconds = record.get("token_expires_in", 600)
    expiration_time = token_created_time + timedelta(seconds=expires_in_seconds)
    
    # Renovação com margem de 30 segundos
    if expiration_time < datetime.now(timezone.utc) + timedelta(seconds=30):
        # 3. RENOVAR SE EXPIRADO
        try:
            print(f"Token para restaurante {restaurante_id} no {plataforma} expirado ou prestes a expirar. Renovando...")
            
            # Chama a API do iFood para renovação
            new_tokens = await _call_token_api(
                data={"refreshToken": refresh_token},
                grant_type="refreshToken"
            )
            
            # 4. ATUALIZAR BANCO COM NOVOS TOKENS
            update_data = {
                "access_token": new_tokens.accessToken,
                "refresh_token": new_tokens.refreshToken,
                "token_expires_in": new_tokens.expiresIn,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            update_response = supabase.table("restaurante_integracoes").update(update_data).eq(
                "restaurante_id", restaurante_id
            ).eq("plataforma", plataforma).execute()
            
            if not update_response.data:
                 raise Exception("Falha na atualização do token renovado no Supabase.")

            # Retorna o registro atualizado
            record.update(update_data) 
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Falha na renovação do token de {plataforma}. Reautorização necessária: {str(e)}"
            )

    # 5. RETORNA O REGISTRO COMPLETO E VÁLIDO
    return record


async def _call_ifood_order_action(access_token: str, order_id: str, action: str):
    """
    Executa ações na API de Pedidos do iFood (Ex: Confirmação, Rejeição, etc.).
    Ação deve ser 'confirm' ou 'cancel'.
    """
    
    # Mapeia a ação para o sufixo da URL do iFood
    # iFood usa POST /orders/{orderId}/confirm ou /orders/{orderId}/cancel
    action_url_suffix = action.lower() 
    
    order_action_url = f"{IFOOD_ORDER_BASE_URL}/orders/{order_id}/{action_url_suffix}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        # A confirmação/cancelamento é geralmente um POST sem corpo (body)
        response = await client.post(
            order_action_url,
            headers={
                "accept": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
        )
        # O iFood retorna 202 Accepted em caso de sucesso
        response.raise_for_status() 
        return response


async def _handle_order_placed_webhook(
    restaurante_id_mestre: str, 
    webhook_payload: IfoodWebhookPayload, 
    supabase: Client
):
    """
    Lógica de processamento pesado para o evento ORDER_PLACED. 
    Esta função deve ser executada em BackgroundTasks.
    """
    order_id = webhook_payload.id # O ID do pedido no iFood (ID do evento é o ID do pedido neste caso)

    try:
        # 1. Obter registro de integração (garante token válido, renova se preciso)
        integration_record = await get_valid_integration_record(
            restaurante_id_mestre, PLATFORM_NAME, supabase
        )
        access_token = integration_record.get("access_token")
        
        # 2. BUSCAR DETALHES COMPLETOS DO PEDIDO (GET /orders/{orderId})
        get_order_url = f"{IFOOD_ORDER_BASE_URL}/orders/{order_id}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            order_details_response = await client.get(
                get_order_url,
                headers={
                    "accept": "application/json",
                    "Authorization": f"Bearer {access_token}"
                }
            )
            order_details_response.raise_for_status()
            
            order_data = order_details_response.json()
            print(f"✅ DETALHES DO PEDIDO {order_id} BUSCADOS COM SUCESSO. Preparando para confirmar...")
            
            # --------------------------------------------------------------------------------
            # >>> LÓGICA CHAVE: INSERIR `order_data` NO SEU SISTEMA (ERP, Banco de dados, etc.)
            # Você deve usar o `restaurante_id_mestre` para associar este pedido ao seu cliente interno.
            # Exemplo (NÃO IMPLEMENTADO): supabase.table("pedidos").insert({"restaurante_id": restaurante_id_mestre, "ifood_order_id": order_id, "data": order_data, ...}).execute()
            # --------------------------------------------------------------------------------
            
            
        # 3. CONFIRMAR O PEDIDO (POST /orders/{orderId}/confirm)
        # Após salvar o pedido no seu sistema, confirme com o iFood.
        await _call_ifood_order_action(access_token, order_id, "confirm")
        print(f"✅ PEDIDO {order_id} CONFIRMADO COM SUCESSO no iFood. Pronto para produção.")

        # --------------------------------------------------------------------------------
        # >>> AQUI: Atualizar o status do pedido no seu banco para 'Confirmado'
        # --------------------------------------------------------------------------------

    except HTTPException as e:
        print(f"❌ ERRO HTTP (WEBHOOK - Background): {e.detail}")
        # Logar erro e notificar
    except httpx.HTTPStatusError as e:
        print(f"❌ ERRO API IFOOD (Status {e.response.status_code}): Falha ao buscar ou confirmar pedido {order_id}. Erro: {e.response.text}")
        # Logar erro para retentativa
    except Exception as e:
        print(f"❌ ERRO INESPERADO no processamento do webhook: {str(e)}")
        # Logar erro fatal


# -----------------------------------------------------------
# ENDPOINT 1: /usercode (INICIA O FLUXO)
# -----------------------------------------------------------
@router.post("/usercode", status_code=status.HTTP_202_ACCEPTED, summary="Passo 1: Inicia o fluxo Device Code e associa ao restaurante ID (UUID)")
async def ifood_device_code_flow(
    request_payload: IfoodUsercodeRequest, 
    restaurante_id: str = Query(..., description=f"ID Mestre (UUID) do restaurante. DEVE existir na tabela restaurantes. Ex: {TESTE_RESTAURANTE_UUID}"),
    supabase: Client = Depends(get_client)
):
    """
    Inicia o fluxo do iFood, obtém o userCode e cria/atualiza um registro na tabela 'restaurante_integracoes'
    mapeando ao seu 'restaurante_id' mestre.
    """
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # 1. CHAMADA REAL PARA API DO IFOOD
            response = await client.post(
                IFOOD_DEVICE_CODE_URL,
                headers={"accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
                data={"clientId": request_payload.clientId}
            )
            
            response.raise_for_status()
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

    # 2. Inserção/Atualização na tabela 'restaurante_integracoes'
    try:
        # Tenta buscar um registro existente primeiro
        check_response = supabase.table("restaurante_integracoes").select("id").eq(
            "restaurante_id", restaurante_id
        ).eq("plataforma", PLATFORM_NAME).limit(1).execute()

        integration_id = check_response.data[0]['id'] if check_response.data else None
        
        insert_update_data = {
            "user_code": ifood_data.userCode,
            "authorization_code_verifier": ifood_data.authorizationCodeVerifier,
            "client_id": request_payload.clientId,
            "access_token": None,
            "refresh_token": None,
            "is_authorized": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        if integration_id:
            # Atualiza o registro existente (USO COMUM)
            response = supabase.table("restaurante_integracoes").update(insert_update_data).eq(
                "id", integration_id
            ).execute()
        else:
            # Insere um novo registro (primeira integração)
            insert_update_data["restaurante_id"] = restaurante_id # Pega do Query Parameter (O UUID válido)
            insert_update_data["plataforma"] = PLATFORM_NAME
            response = supabase.table("restaurante_integracoes").insert(insert_update_data).execute()


        if response.data:
            return {
                "message": "✅ Fluxo Device Code iniciado e registro criado/atualizado para o seu restaurante ID.",
                "restaurante_id": restaurante_id,
                "ifood_user_code": ifood_data.userCode,
                "verification_url_complete": ifood_data.verificationUrlComplete,
            }
        else:
            raise Exception("Inserção/Atualização no Supabase falhou sem erro detalhado.")

    except Exception as e:
        # Captura o erro de chave estrangeira (FK) e detalha a causa
        detail_error = str(e).strip()
        if 'violates foreign key constraint' in detail_error:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"ERRO DE CHAVE ESTRANGEIRA (UUID INVÁLIDO): O 'restaurante_id' '{restaurante_id}' deve ser um UUID válido e existir na sua tabela 'restaurantes'."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro fatal ao inserir/atualizar integração: {detail_error}"
            )

# -----------------------------------------------------------
# ENDPOINT 2: /token (TROCA CÓDIGO POR TOKENS)
# -----------------------------------------------------------
@router.post("/token", summary="Passo 2: Troca o código de autorização por tokens e mapeia o ID externo")
async def exchange_token_flow(
    request_payload: IfoodTokenRequest,
    supabase: Client = Depends(get_client)
):
    """
    Troca o código de autorização e armazena o merchant_id do iFood na coluna external_merchant_id.
    """
    
    # 1. BUSCAR O REGISTRO DE INTEGRAÇÃO PELO user_code
    fetch_response = supabase.table("restaurante_integracoes").select("*").eq(
        "user_code", request_payload.user_code
    ).limit(1).execute()
    
    if not fetch_response.data:
        raise HTTPException(status_code=404, detail="User code não encontrado ou expirado. Reautorize.")

    record = fetch_response.data[0]
    auth_code_verifier = record.get("authorization_code_verifier")
    integration_id = record.get("id") 
    restaurante_id = record.get("restaurante_id") # SEU UUID MESTRE
    
    if not auth_code_verifier:
        raise HTTPException(status_code=400, detail="Authorization code verifier ausente no registro de integração.")

    # 2. CHAMADA À API DO IFOOD PARA TROCA DE TOKEN
    try:
        token_response_data = await _call_token_api(
            data={"authorizationCodeVerifier": auth_code_verifier},
            grant_type="authorizationCode"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro na troca de token. Verifique se o código foi autorizado. Erro iFood: {str(e)}"
        )

    # 3. ATUALIZAR O REGISTRO DE INTEGRAÇÃO com o token e o ID externo
    try:
        update_data = {
            "access_token": token_response_data.accessToken,
            "refresh_token": token_response_data.refreshToken,
            "token_expires_in": token_response_data.expiresIn,
            "external_merchant_id": token_response_data.merchantId, # SALVA O ID EXTERNO DO IFOOD AQUI!
            "is_authorized": True,
            "user_code": None, 
            "authorization_code_verifier": None, 
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        update_response = supabase.table("restaurante_integracoes").update(update_data).eq(
            "id", integration_id
        ).execute()

        if update_response.data:
            return {
                "message": "✅ Tokens de acesso obtidos e ID externo mapeado com sucesso!",
                "restaurante_id": restaurante_id,
                "ifood_merchant_id": token_response_data.merchantId,
            }
        else:
            raise Exception("Atualização da integração no Supabase falhou.")

    except Exception as e:
        detail_error = str(e).strip()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro fatal ao atualizar tokens e mapear IDs: {detail_error}"
        )

# -----------------------------------------------------------
# ENDPOINT 3: /merchant/status (VERIFICA O STATUS DA LOJA)
# -----------------------------------------------------------
@router.get("/merchant/status", response_model=IfoodMerchantStatusResponse, summary="Verifica o Status Operacional da Loja")
async def get_merchant_status(
    request_payload: IntegrationIdentifierRequest = Depends(),
    supabase: Client = Depends(get_client)
):
    """Busca o status operacional da loja do iFood, usando o UUID interno para obter o token e o ID externo."""
    restaurante_id = request_payload.restaurante_id
    
    try:
        # 1. GARANTE QUE O TOKEN ESTÁ VÁLIDO E PEGA O REGISTRO (RENONOVA SE PRECISO)
        record = await get_valid_integration_record(restaurante_id, PLATFORM_NAME, supabase)
        
        access_token = record.get("access_token")
        merchant_id = record.get("external_merchant_id") # O ID externo do iFood

        if not merchant_id:
             raise HTTPException(status_code=400, detail="ID externo do iFood (merchant_id) ainda não foi mapeado para este restaurante. Complete o Passo 2.")
        
        # 2. CHAMA A API DO IFOOD
        async with httpx.AsyncClient(timeout=10.0) as client:
            status_url = f"{IFOOD_MERCHANT_BASE_URL}/merchants/{merchant_id}/status"
            
            response = await client.get(
                status_url,
                headers={
                    "accept": "application/json",
                    "Authorization": f"Bearer {access_token}"
                }
            )
            
            response.raise_for_status()
            
            return IfoodMerchantStatusResponse(**response.json())

    except HTTPException as e:
        raise e
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Erro na API de Status do iFood: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro inesperado: {str(e)}")


# -----------------------------------------------------------
# ENDPOINT 4: /merchant/menu (EXEMPLO DE LEITURA OPERACIONAL)
# -----------------------------------------------------------
@router.get("/merchant/menu", response_model=IfoodMenuResponse, summary="Busca o Cardápio (Menu) Completo do Restaurante")
async def get_merchant_menu(
    request_payload: IntegrationIdentifierRequest = Depends(),
    supabase: Client = Depends(get_client)
):
    """
    Endpoint que demonstra como usar o Access Token válido para buscar dados do iFood (Ex: Cardápio).
    """
    restaurante_id = request_payload.restaurante_id
    
    try:
        # 1. GARANTE QUE O TOKEN ESTÁ VÁLIDO E PEGA O REGISTRO
        record = await get_valid_integration_record(restaurante_id, PLATFORM_NAME, supabase)
        
        access_token = record.get("access_token")
        merchant_id = record.get("external_merchant_id")

        if not merchant_id:
             raise HTTPException(status_code=400, detail="ID externo do iFood (merchant_id) ainda não foi mapeado para este restaurante. Complete o Passo 2.")
        
        # 2. CHAMA A API DO IFOOD
        async with httpx.AsyncClient(timeout=10.0) as client:
            # URL de exemplo para o endpoint de Cardápio/Menu
            menu_url = f"{IFOOD_MERCHANT_BASE_URL}/merchants/{merchant_id}/menus" 
            
            response = await client.get(
                menu_url,
                headers={
                    "accept": "application/json",
                    "Authorization": f"Bearer {access_token}"
                }
            )
            
            response.raise_for_status()
            
            # 3. Retorna a resposta (ou o modelo Pydantic correspondente)
            # Para fins de teste em Sandbox, o iFood pode retornar dados mockados ou vazios.
            return response.json() 

    except HTTPException as e:
        raise e
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Erro na API de Menu do iFood: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro inesperado: {str(e)}")


# -----------------------------------------------------------
# ENDPOINT 5: /webhook (RECEBE EVENTOS EM TEMPO REAL)
# -----------------------------------------------------------
@router.post("/webhook", status_code=status.HTTP_200_OK, summary="Recebe Webhooks da API do iFood e mapeia para o ID interno")
async def ifood_webhook_receiver(
    payload: IfoodWebhookPayload, 
    background_tasks: BackgroundTasks, # Adicionado para processamento assíncrono
    supabase: Client = Depends(get_client)
):
    """
    Recebe eventos em tempo real do iFood. Mapeia o 'merchantId' (ID externo) para o 'restaurante_id' (UUID interno).
    O processamento pesado (`ORDER_PLACED` e ações) é delegado a BackgroundTasks.
    """
    
    # 1. EXTRAI O ID EXTERNO (iFood)
    external_merchant_id = payload.metadata.get("merchantId") 
    
    if not external_merchant_id:
        print("Webhook recebido sem Merchant ID na metadata.")
        return {"message": "Webhook recebido, mas sem ID externo para mapeamento."}

    # 2. BUSCA O SEU UUID MESTRE INTERNO (o seu 'restaurante_id')
    fetch_response = supabase.table("restaurante_integracoes").select("restaurante_id").eq(
        "external_merchant_id", external_merchant_id
    ).eq("plataforma", PLATFORM_NAME).limit(1).execute()
    
    if not fetch_response.data:
        print(f"Merchant ID {external_merchant_id} não mapeado para um restaurante interno.")
        return {"message": "Webhook recebido, mas o ID externo não está mapeado."}

    # O SEU UUID MESTRE! Este é o ID que você deve usar para processar o pedido.
    restaurante_id_mestre = fetch_response.data[0]['restaurante_id'] 

    # 3. LOGGING E PROCESSAMENTO DE EVENTOS
    print(f"WEBHOOK RECEBIDO: {payload.code} -> Mapeado para SEU ID MESTRE (UUID): {restaurante_id_mestre}")
    
    if payload.code == "ORDER_PLACED":
        # DELEGA O PROCESSAMENTO PESADO (Buscar + Confirmar) PARA TAREFAS EM SEGUNDO PLANO
        background_tasks.add_task(
            _handle_order_placed_webhook,
            restaurante_id_mestre, 
            payload, 
            supabase
        )
        print(f"⏳ EVENTO ORDER_PLACED ({payload.id}) delegado para processamento em segundo plano.")
        
    elif payload.code == "ORDER_CONFIRMED":
        # Exemplo de tratamento de outros eventos
        # Normalmente usado para logar ou sincronizar o status no seu sistema
        print(f"🔔 EVENTO: Pedido {payload.id} confirmado no iFood. Atualizar status no ERP.")
    
    elif payload.code == "ORDER_CANCELED":
        print(f"❌ EVENTO: Pedido {payload.id} cancelado no iFood. Notificar o restaurante e estornar.")

    # 4. RESPOSTA RÁPIDA OBRIGATÓRIA
    # Retorna 200 OK imediatamente para o iFood.
    return {"message": f"Webhook {payload.code} recebido e roteado para processamento."}
