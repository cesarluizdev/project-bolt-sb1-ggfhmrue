import React from 'react';
import { 
  Package, 
  Smartphone, 
  Clock, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Bell,
  User,
  Wifi,
  Database,
  Headphones,
  Globe,
  Layers,
  Target,
  Award,
  Rocket,
  Heart,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Wifi,
      title: 'Integração Automática',
      description: 'Conecte-se automaticamente com Ifood, Rappi, 99Food e Keeta em poucos cliques'
    },
    {
      icon: Clock,
      title: 'Tempo Real',
      description: 'Receba pedidos instantaneamente e acompanhe o status em tempo real'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Relatórios detalhados sobre vendas, performance e insights do seu negócio'
    },
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Dados protegidos com criptografia de ponta e backup automático'
    },
    {
      icon: Smartphone,
      title: 'Multi-dispositivo',
      description: 'Acesse de qualquer lugar: computador, tablet ou smartphone'
    },
    {
      icon: Headphones,
      title: 'Suporte 24/7',
      description: 'Equipe especializada disponível todos os dias para te ajudar'
    }
  ];

  const integrations = [
    { 
      name: 'Ifood', 
      logo: '🍔', 
      color: 'from-red-500 to-red-600',
      description: 'Maior plataforma de delivery do Brasil'
    },
    { 
      name: 'Rappi', 
      logo: '🛵', 
      color: 'from-orange-500 to-orange-600',
      description: 'Delivery rápido e eficiente'
    },
    { 
      name: '99Food', 
      logo: '🚗', 
      color: 'from-yellow-500 to-yellow-600',
      description: 'Tecnologia e inovação em delivery'
    },
    { 
      name: 'Keeta', 
      logo: '🏍️', 
      color: 'from-purple-500 to-purple-600',
      description: 'Nova geração de delivery'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumente suas vendas em até 40%',
      description: 'Gestão eficiente de pedidos resulta em mais vendas e clientes satisfeitos'
    },
    {
      icon: Target,
      title: 'Reduza erros em 90%',
      description: 'Sistema automatizado elimina erros manuais e retrabalho'
    },
    {
      icon: Clock,
      title: 'Economize 3 horas por dia',
      description: 'Automatize processos e foque no que realmente importa: seu negócio'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Dono da Pizzaria Bella Napoli',
      content: 'Desde que começamos a usar o sistema, nossas vendas aumentaram 35% e conseguimos atender muito mais pedidos sem estresse.',
      rating: 5,
      avatar: '👨‍🍳'
    },
    {
      name: 'Ana Santos',
      role: 'Gerente do Burger House',
      content: 'A interface é muito intuitiva e o suporte é excepcional. Não conseguimos mais trabalhar sem essa ferramenta!',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'João Oliveira',
      role: 'Proprietário Sushi Zen',
      content: 'O sistema revolucionou nossa operação. Agora temos controle total sobre todos os pedidos em uma única tela.',
      rating: 5,
      avatar: '👨‍💻'
    }
  ];

  const stats = [
    { number: '2.500+', label: 'Restaurantes Ativos', icon: Users },
    { number: '150k+', label: 'Pedidos/Mês', icon: Package },
    { number: '99.9%', label: 'Uptime', icon: Zap },
    { number: '24/7', label: 'Suporte', icon: Headphones }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Grátis',
      period: 'para sempre',
      description: 'Perfeito para começar',
      features: [
        'Até 100 pedidos/mês',
        '2 marketplaces',
        'Relatórios básicos',
        'Suporte por email'
      ],
      cta: 'Começar Grátis',
      popular: false
    },
    {
      name: 'Professional',
      price: 'R$ 97',
      period: '/mês',
      description: 'Para restaurantes em crescimento',
      features: [
        'Pedidos ilimitados',
        'Todos os marketplaces',
        'Relatórios avançados',
        'Suporte prioritário',
        'API personalizada',
        'Backup automático'
      ],
      cta: 'Teste 30 dias grátis',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      period: '',
      description: 'Para grandes operações',
      features: [
        'Tudo do Professional',
        'Múltiplas lojas',
        'Gerente dedicado',
        'Treinamento personalizado',
        'SLA garantido',
        'Integrações customizadas'
      ],
      cta: 'Falar com Vendas',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl mb-8">
              <Package className="h-10 w-10 text-white" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Gerencie todos os seus
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                pedidos de delivery
              </span>
              <span className="block text-3xl md:text-4xl text-slate-200 font-normal mt-2">
                em uma única plataforma
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Conecte Ifood, Rappi, 99Food e Keeta automaticamente. 
              <span className="text-orange-300 font-semibold"> Aumente suas vendas em até 40%</span> 
              com nossa tecnologia de ponta.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 text-lg"
              >
                <Rocket className="h-6 w-6" />
                Começar Grátis Agora
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 text-lg">
                <Play className="h-5 w-5" />
                Ver Demonstração
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-300">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-400" />
                <span>Teste grátis 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                <span>2.500+ restaurantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Resultados comprovados que transformam restaurantes em negócios de sucesso
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Integre com os principais marketplaces
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Conecte-se automaticamente com as maiores plataformas de delivery do Brasil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-100">
                <div className={`w-20 h-20 bg-gradient-to-r ${integration.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {integration.logo}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {integration.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {integration.description}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Integrado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tudo que você precisa para gerenciar seu delivery com máxima eficiência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-slate-600">
              Depoimentos reais de restaurantes que transformaram suas operações
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Planos que se adaptam ao seu negócio
            </h2>
            <p className="text-xl text-slate-600">
              Comece grátis e escale conforme seu restaurante cresce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                plan.popular ? 'ring-2 ring-orange-500 relative' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                    {plan.period && <span className="text-slate-600">{plan.period}</span>}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl mb-8">
            <Award className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para revolucionar seu delivery?
          </h2>
          
          <p className="text-xl text-slate-200 mb-8 leading-relaxed">
            Junte-se a mais de 2.500 restaurantes que já aumentaram suas vendas e otimizaram suas operações. 
            Configure sua conta em menos de 5 minutos e comece a ver resultados hoje mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 text-lg"
            >
              <Rocket className="h-6 w-6" />
              Começar Grátis Agora
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Setup gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Teste 30 dias grátis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Zentro Solution</span>
            </div>
            
            <div className="text-slate-400 text-sm">
              © 2024 Zentro Solution. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;