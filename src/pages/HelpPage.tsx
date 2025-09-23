import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronRight,
  Play,
  FileText,
  Video,
  Headphones,
  Clock,
  CheckCircle,
  ExternalLink,
  Download,
  Smartphone,
  Monitor,
  Settings,
  Users,
  Package,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Star,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'article' | 'tutorial';
  category: string;
  icon: React.ComponentType<any>;
}

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Todas as categorias', icon: Book },
    { id: 'getting-started', name: 'Primeiros Passos', icon: Play },
    { id: 'orders', name: 'Gestão de Pedidos', icon: Package },
    { id: 'products', name: 'Produtos', icon: Settings },
    { id: 'customers', name: 'Clientes', icon: Users },
    { id: 'reports', name: 'Relatórios', icon: BarChart3 },
    { id: 'integrations', name: 'Integrações', icon: Zap },
    { id: 'billing', name: 'Faturamento', icon: FileText },
    { id: 'technical', name: 'Suporte Técnico', icon: Shield }
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Como conectar meu restaurante aos marketplaces?',
      answer: 'Para conectar seu restaurante aos marketplaces, acesse a página de Configurações, clique na aba "Integrações" e siga o passo a passo para cada marketplace. Você precisará das chaves de API fornecidas por cada plataforma (Ifood, Rappi, 99Food, etc.). O processo é simples e leva apenas alguns minutos.',
      category: 'integrations'
    },
    {
      id: '2',
      question: 'Como aceitar um pedido no sistema?',
      answer: 'Na tela principal de pedidos, você verá todos os pedidos pendentes destacados. Clique no pedido desejado para ver os detalhes e depois clique no botão "Aceitar Pedido". O sistema automaticamente notificará o marketplace e o cliente sobre a confirmação.',
      category: 'orders'
    },
    {
      id: '3',
      question: 'Posso pausar produtos em todos os marketplaces ao mesmo tempo?',
      answer: 'Sim! Na página de Gestão de Produtos, você pode pausar um produto clicando no botão "Pausar". Esta ação será sincronizada automaticamente com todos os marketplaces conectados, removendo temporariamente o produto de todas as plataformas.',
      category: 'products'
    },
    {
      id: '4',
      question: 'Como visualizar relatórios de vendas?',
      answer: 'Acesse a página de Relatórios no menu principal. Lá você encontrará dashboards completos com métricas de vendas, pedidos por marketplace, produtos mais vendidos, e muito mais. Você pode filtrar por período e exportar os dados.',
      category: 'reports'
    },
    {
      id: '5',
      question: 'O sistema funciona em tablets e smartphones?',
      answer: 'Sim! O sistema é totalmente responsivo e funciona perfeitamente em tablets, smartphones e computadores. A interface se adapta automaticamente ao tamanho da tela, garantindo uma experiência otimizada em qualquer dispositivo.',
      category: 'technical'
    },
    {
      id: '6',
      question: 'Como cadastrar novos produtos?',
      answer: 'Na página de Produtos, clique em "Novo Produto" e preencha as informações necessárias: nome, descrição, categoria, preço, tempo de preparo e imagem. Você também pode escolher em quais marketplaces sincronizar o produto.',
      category: 'products'
    },
    {
      id: '7',
      question: 'Posso gerenciar informações dos meus clientes?',
      answer: 'Sim! Na página de Clientes você pode visualizar todos os clientes, suas informações de contato, histórico de pedidos, valor total gasto e muito mais. Também é possível editar informações e adicionar observações.',
      category: 'customers'
    },
    {
      id: '8',
      question: 'Como funciona a cobrança do sistema?',
      answer: 'Oferecemos um plano gratuito para até 100 pedidos/mês. Para volumes maiores, temos planos pagos a partir de R$ 97/mês com recursos avançados. Você pode testar qualquer plano por 30 dias gratuitamente.',
      category: 'billing'
    },
    {
      id: '9',
      question: 'O que fazer se um marketplace não estiver sincronizando?',
      answer: 'Primeiro, verifique se as credenciais de API estão corretas na página de Configurações. Se o problema persistir, use o botão "Testar Conexão" para diagnosticar o problema. Nossa equipe de suporte também está disponível 24/7 para ajudar.',
      category: 'technical'
    },
    {
      id: '10',
      question: 'Como começar a usar o sistema?',
      answer: 'Após criar sua conta, siga estes passos: 1) Configure as integrações com os marketplaces, 2) Cadastre seus produtos, 3) Teste recebendo alguns pedidos, 4) Explore os relatórios. Temos guias detalhados para cada etapa.',
      category: 'getting-started'
    }
  ];

  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'Configuração Inicial do Sistema',
      description: 'Aprenda a configurar seu restaurante e conectar com os marketplaces em poucos minutos',
      duration: '5 min',
      type: 'video',
      category: 'getting-started',
      icon: Play
    },
    {
      id: '2',
      title: 'Gerenciando Pedidos em Tempo Real',
      description: 'Como aceitar, preparar e acompanhar pedidos de todos os marketplaces',
      duration: '8 min',
      type: 'tutorial',
      category: 'orders',
      icon: Package
    },
    {
      id: '3',
      title: 'Cadastro e Sincronização de Produtos',
      description: 'Guia completo para adicionar produtos e sincronizar com marketplaces',
      duration: '10 min',
      type: 'article',
      category: 'products',
      icon: Settings
    },
    {
      id: '4',
      title: 'Análise de Relatórios e Métricas',
      description: 'Entenda seus dados de vendas e tome decisões baseadas em dados',
      duration: '12 min',
      type: 'video',
      category: 'reports',
      icon: BarChart3
    },
    {
      id: '5',
      title: 'Gestão de Clientes e Relacionamento',
      description: 'Como usar os dados dos clientes para melhorar seu negócio',
      duration: '6 min',
      type: 'article',
      category: 'customers',
      icon: Users
    },
    {
      id: '6',
      title: 'Solução de Problemas Comuns',
      description: 'Resolva os problemas mais frequentes de forma rápida e eficiente',
      duration: '15 min',
      type: 'tutorial',
      category: 'technical',
      icon: Shield
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'tutorial': return Book;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'tutorial': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const contactOptions = [
    {
      title: 'Chat ao Vivo',
      description: 'Fale conosco agora mesmo',
      icon: MessageCircle,
      color: 'bg-blue-500',
      available: '24/7'
    },
    {
      title: 'Telefone',
      description: '(11) 4000-0000',
      icon: Phone,
      color: 'bg-green-500',
      available: '8h às 18h'
    },
    {
      title: 'Email',
      description: 'suporte@fooddeliverymonitor.com',
      icon: Mail,
      color: 'bg-orange-500',
      available: 'Resposta em 2h'
    },
    {
      title: 'WhatsApp',
      description: '(11) 99999-9999',
      icon: MessageCircle,
      color: 'bg-green-600',
      available: '24/7'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl shadow-2xl mb-6">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Central de Ajuda
            </h1>
            <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
              Encontre respostas, guias e suporte para aproveitar ao máximo seu sistema de delivery
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Busque por dúvidas, tutoriais ou funcionalidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 text-lg border-0 rounded-xl shadow-lg focus:ring-4 focus:ring-orange-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm font-medium text-center">{category.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{option.available}</span>
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
                      Contatar <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Guides */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guias e Tutoriais</h2>
            <div className="space-y-4">
              {filteredGuides.map((guide) => {
                const Icon = guide.icon;
                const TypeIcon = getTypeIcon(guide.type);
                return (
                  <div key={guide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(guide.type)}`}>
                            {guide.type === 'video' ? 'Vídeo' : guide.type === 'article' ? 'Artigo' : 'Tutorial'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{guide.duration}</span>
                          </div>
                          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
                            <TypeIcon className="h-4 w-4" />
                            Acessar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos Adicionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <Download className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Manual do Usuário</h3>
              <p className="text-gray-600 text-sm mb-4">Guia completo em PDF com todas as funcionalidades</p>
              <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 mx-auto">
                <Download className="h-4 w-4" />
                Baixar PDF
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <Video className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Webinars</h3>
              <p className="text-gray-600 text-sm mb-4">Sessões ao vivo com dicas e melhores práticas</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mx-auto">
                <ExternalLink className="h-4 w-4" />
                Ver Agenda
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Comunidade</h3>
              <p className="text-gray-600 text-sm mb-4">Conecte-se com outros restaurantes e compartilhe experiências</p>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 mx-auto">
                <ExternalLink className="h-4 w-4" />
                Participar
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-16 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Status do Sistema</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800">API: Operacional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800">Ifood: Conectado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800">Rappi: Conectado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800">99Food: Conectado</span>
            </div>
          </div>
          <p className="text-green-700 text-sm mt-3">
            Todos os sistemas operando normalmente. Última verificação: há 2 minutos.
          </p>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-8 text-center text-white">
          <Headphones className="h-16 w-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold mb-4">Ainda precisa de ajuda?</h3>
          <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
            Nossa equipe de suporte está disponível 24/7 para ajudar você a resolver qualquer dúvida ou problema.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Iniciar Chat
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Ligar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;