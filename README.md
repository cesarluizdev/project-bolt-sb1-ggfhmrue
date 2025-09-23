# Monitor de Pedidos - Zentro Solution

Sistema de monitoramento de pedidos em tempo real para restaurantes que recebem pedidos de múltiplos marketplaces de food delivery com autenticação segura.

## 🔐 Sistema de Autenticação

### Banco de Dados PostgreSQL (Supabase)
- **Autenticação segura** com email e senha
- **Criação de contas** com nome completo
- **Sessões persistentes** com tokens JWT
- **Logout seguro** em todas as páginas

### Tela de Login
- **Design moderno** com glassmorphism
- **Alternância** entre login e cadastro
- **Validação em tempo real** de formulários
- **Feedback visual** para erros e sucessos
- **Responsivo** para todos os dispositivos

## 🎨 Identidade Visual

### Paleta de Cores Principal
- **Azul Escuro (Primário)**: `slate-700` (#334155) e `slate-800` (#1e293b)
- **Laranja (Secundário)**: `orange-500` (#f97316) e `orange-600` (#ea580c)
- **Branco**: `white` (#ffffff)

### Cores de Status
- **Pendente**: `yellow-100/yellow-800` (#fef3c7/#92400e)
- **Confirmado**: `blue-100/blue-800` (#dbeafe/#1e40af)
- **Preparando**: `orange-100/orange-800` (#fed7aa/#9a3412)
- **Enviado**: `purple-100/purple-800` (#f3e8ff/#6b21a8)
- **Entregue**: `green-100/green-800` (#dcfce7/#166534)
- **Cancelado**: `red-100/red-800` (#fee2e2/#991b1b)

### Cores dos Marketplaces
- **Rappi**: `orange-100/orange-800` (#fed7aa/#9a3412)
- **Ifood**: `red-100/red-800` (#fee2e2/#991b1b)
- **99Food**: `yellow-100/yellow-800` (#fef3c7/#92400e)

### Cores de Suporte
- **Cinza Claro**: `gray-50` (#f9fafb) - Background
- **Cinza Médio**: `gray-100` (#f3f4f6) - Cards
- **Cinza Escuro**: `gray-600` (#4b5563) - Textos secundários
- **Cinza Texto**: `gray-900` (#111827) - Textos principais

## 🚀 Funcionalidades

### Atual (Desenvolvimento)
- ✅ Sistema de autenticação completo
- ✅ Tela de login responsiva e moderna
- ✅ Proteção de rotas privadas
- ✅ Interface de monitoramento com dados mock
- ✅ Visualização de pedidos por cards
- ✅ Detalhes completos dos pedidos
- ✅ Dashboard com contadores de status
- ✅ Efeito de alerta para pedidos pendentes (>1)
- ✅ Design responsivo

### Preparado para Produção
- 🔄 Configuração do Supabase
- 🔄 Integração com APIs dos marketplaces
- 🔄 Atualização em tempo real (30s)
- 🔄 Gerenciamento de estados dos pedidos
- 🔄 Tratamento de erros e loading
- 🔄 Reconexão automática

## 📱 Marketplaces Suportados

1. **Rappi** - Pedidos de delivery rápido
2. **Ifood** - Maior plataforma de food delivery
3. **99Food** - Plataforma de delivery da 99

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Supabase** para autenticação e PostgreSQL
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Vite** como bundler
- **Custom Hooks** para gerenciamento de estado

## 📊 Estrutura de Dados

### Order Interface
```typescript
interface Order {
  id: string;
  orderNumber: string;
  marketplace: 'Rappi' | 'Ifood' | '99Food';
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  deliveryFee: number;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery: string;
  restaurant: Restaurant;
  notes?: string;
}
```

## 🔧 Configuração da API

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_REACT_APP_API_URL=http://localhost:3001/api
```

### Configuração do Supabase
1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie a URL do projeto e a chave anônima
3. Configure as variáveis de ambiente no arquivo `.env`
4. A autenticação será configurada automaticamente

### Endpoints Esperados
- `GET /api/orders` - Todos os pedidos
- `GET /api/orders/rappi` - Pedidos do Rappi
- `GET /api/orders/Ifood` - Pedidos do Ifood
- `GET /api/orders/99food` - Pedidos do 99Food
- `PATCH /api/orders/:id/status` - Atualizar status

## 🎯 Próximos Passos

1. **Integração Backend**
   - Configurar Supabase em produção
   - Implementar APIs dos marketplaces
   - Configurar webhooks para atualizações em tempo real

2. **Funcionalidades Avançadas**
   - Notificações push para novos pedidos
   - Relatórios e analytics
   - Impressão de pedidos
   - Chat com clientes

3. **Otimizações**
   - Cache de dados
   - Offline support
   - Performance monitoring

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Notas de Desenvolvimento

- **Autenticação obrigatória** para acessar o sistema
- Tela de login aparece antes do monitor de pedidos
- Em desenvolvimento, usa dados mock automaticamente
- Em produção, conecta com APIs reais
- Atualização automática a cada 30 segundos
- Tratamento de erros e estados de loading
- Interface otimizada para uso em tablets e desktops

## 🔒 Segurança

- **Autenticação JWT** via Supabase
- **Rotas protegidas** com ProtectedRoute
- **Sessões seguras** com renovação automática
- **Logout em todas as abas** sincronizado
- **Validação de formulários** no frontend e backend