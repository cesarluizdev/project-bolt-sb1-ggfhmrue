# Zentro Solution - Backend API

Backend em Python com FastAPI para o sistema de monitoramento de pedidos de delivery.

## 🚀 Tecnologias

- **Python 3.11+**
- **FastAPI** - Framework web moderno e rápido
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth)
- **SQLAlchemy** - ORM para Python
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicação principal
│   ├── config.py            # Configurações
│   ├── database.py          # Conexão com banco
│   ├── dependencies.py      # Dependências globais
│   ├── middleware.py        # Middlewares customizados
│   ├── models/              # Modelos SQLAlchemy
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── order.py
│   │   ├── product.py
│   │   └── customer.py
│   ├── schemas/             # Schemas Pydantic
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── order.py
│   │   ├── product.py
│   │   └── customer.py
│   ├── services/            # Lógica de negócio
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── order_service.py
│   │   ├── product_service.py
│   │   └── customer_service.py
│   └── routers/             # Rotas da API
│       ├── __init__.py
│       ├── auth.py
│       ├── orders.py
│       ├── products.py
│       └── customers.py
├── requirements.txt         # Dependências Python
├── Dockerfile              # Container Docker
├── docker-compose.yml      # Orquestração Docker
├── .env                    # Variáveis de ambiente
├── .env.example           # Exemplo de variáveis
└── README.md              # Este arquivo
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2. Instalação Local

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Executar com Docker

```bash
# Build e executar
docker-compose up --build

# Executar em background
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down
```

## 📚 API Endpoints

### Autenticação
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Dados do usuário atual

### Pedidos
- `GET /api/v1/orders/` - Listar pedidos
- `POST /api/v1/orders/` - Criar pedido
- `GET /api/v1/orders/{id}` - Obter pedido
- `PUT /api/v1/orders/{id}` - Atualizar pedido
- `PATCH /api/v1/orders/{id}/status` - Atualizar status
- `DELETE /api/v1/orders/{id}` - Deletar pedido
- `GET /api/v1/orders/stats` - Estatísticas
- `GET /api/v1/orders/rappi/` - Pedidos Rappi
- `GET /api/v1/orders/Ifood/` - Pedidos Ifood
- `GET /api/v1/orders/99food/` - Pedidos 99Food

### Produtos
- `GET /api/v1/products/` - Listar produtos
- `POST /api/v1/products/` - Criar produto
- `GET /api/v1/products/{id}` - Obter produto
- `PUT /api/v1/products/{id}` - Atualizar produto
- `PATCH /api/v1/products/{id}/status` - Atualizar status
- `DELETE /api/v1/products/{id}` - Deletar produto
- `GET /api/v1/products/stats` - Estatísticas

### Clientes
- `GET /api/v1/customers/` - Listar clientes
- `POST /api/v1/customers/` - Criar cliente
- `GET /api/v1/customers/{id}` - Obter cliente
- `PUT /api/v1/customers/{id}` - Atualizar cliente
- `DELETE /api/v1/customers/{id}` - Deletar cliente
- `GET /api/v1/customers/email/{email}` - Buscar por email
- `GET /api/v1/customers/stats` - Estatísticas

### Sistema
- `GET /health` - Health check
- `GET /` - Informações da API

## 🔒 Autenticação

A API usa **JWT tokens** via Supabase Auth:

1. **Registro/Login**: Use os endpoints de auth para obter token
2. **Headers**: Inclua `Authorization: Bearer <token>` em todas as requisições
3. **Renovação**: Use `/auth/refresh` para renovar tokens expirados

Exemplo de uso:

```javascript
// Login
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { access_token } = await response.json();

// Usar token nas requisições
const orders = await fetch('/api/v1/orders/', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

## 📊 Modelos de Dados

### Order (Pedido)
```python
{
  "id": "uuid",
  "order_number": "ORD-000001",
  "marketplace": "Ifood",
  "status": "pending",
  "total": 45.90,
  "customer_name": "João Silva",
  "items": [...],
  "delivery_address": {...}
}
```

### Product (Produto)
```python
{
  "id": "uuid",
  "name": "Big Mac",
  "category": "Hambúrguers",
  "price": 32.90,
  "status": "active",
  "marketplaces": ["Ifood", "rappi"]
}
```

### Customer (Cliente)
```python
{
  "id": "uuid",
  "name": "Maria Santos",
  "email": "maria@email.com",
  "total_orders": 15,
  "total_spent": 450.00,
  "status": "active"
}
```

## 🧪 Testes

```bash
# Instalar dependências de teste
pip install pytest pytest-asyncio httpx

# Executar testes
pytest

# Com cobertura
pytest --cov=app
```

## 📝 Logs

A aplicação usa **Loguru** para logs estruturados:

- **INFO**: Operações normais
- **WARNING**: Situações de atenção
- **ERROR**: Erros de aplicação
- **DEBUG**: Informações detalhadas (apenas em desenvolvimento)

Logs incluem:
- Request ID único
- Tempo de processamento
- Detalhes de autenticação
- Erros de validação

## 🚀 Deploy

### Produção com Docker

```bash
# Build para produção
docker build -t food-delivery-api .

# Executar
docker run -p 8000:8000 --env-file .env food-delivery-api
```

### Variáveis de Produção

```env
DEBUG=False
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://your-frontend-domain.com
JWT_SECRET_KEY=super-secure-production-key
```

## 🔧 Desenvolvimento

### Adicionar Nova Funcionalidade

1. **Modelo**: Criar em `app/models/`
2. **Schema**: Definir em `app/schemas/`
3. **Service**: Implementar lógica em `app/services/`
4. **Router**: Criar endpoints em `app/routers/`
5. **Registrar**: Incluir router em `app/main.py`

### Estrutura de Commit

```
feat: adicionar endpoint de relatórios
fix: corrigir validação de email
docs: atualizar README
refactor: reorganizar services
```

## 🔗 Integração Ifood OAuth2

### Configuração
1. Obtenha credenciais do Ifood Developer Portal
2. Configure as variáveis de ambiente:
   ```env
   Ifood_CLIENT_ID=your-client-id
   Ifood_CLIENT_SECRET=your-client-secret
   Ifood_BASE_URL=https://merchant-api.Ifood.com.br
   ```

### Fluxo OAuth2
1. **Iniciar autorização**: `POST /api/v1/Ifood/auth/authorize`
2. **Processar callback**: `POST /api/v1/Ifood/auth/callback`
3. **Verificar status**: `GET /api/v1/Ifood/auth/status/{merchant_id}`
4. **Renovar token**: `POST /api/v1/Ifood/auth/refresh/{merchant_id}`
5. **Revogar autorização**: `DELETE /api/v1/Ifood/auth/revoke/{merchant_id}`

### Endpoints da API
- **Buscar pedidos**: `GET /api/v1/Ifood/orders/{merchant_id}`
- **Buscar cardápio**: `GET /api/v1/Ifood/menu/{merchant_id}`

### Testes
```bash
# Executar testes de integração
cd backend
pytest tests/test_Ifood_integration.py -v
```

## 🚀 Como Executar

## 📞 Suporte

- **Documentação**: `/docs` (Swagger UI)
- **Health Check**: `/health`
- **Logs**: Verifique os logs da aplicação
- **Issues**: Reporte problemas no repositório

---

**Zentro Solution API** - Sistema completo para gestão de delivery 🍕🚀