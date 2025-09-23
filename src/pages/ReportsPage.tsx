import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Clock, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react';

interface ReportCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');

  const reportCards: ReportCard[] = [
    {
      title: 'Receita Total',
      value: 'R$ 45.280,50',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Pedidos Totais',
      value: '1.247',
      change: '+8.2%',
      changeType: 'positive',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 36,32',
      change: '+3.8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: 'Tempo Médio',
      value: '28 min',
      change: '-2.1%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Cancelamento',
      value: '2.8%',
      change: '-0.5%',
      changeType: 'positive',
      icon: Target,
      color: 'text-red-600'
    },
    {
      title: 'Clientes Únicos',
      value: '892',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-indigo-600'
    }
  ];

  const marketplaceData: ChartData[] = [
    { name: 'Ifood', value: 45, color: '#ef4444' },
    { name: 'Rappi', value: 30, color: '#f97316' },
    { name: '99Food', value: 20, color: '#eab308' },
    { name: 'Keeta', value: 5, color: '#8b5cf6' }
  ];

  const hourlyData = [
    { hour: '08h', orders: 12 },
    { hour: '09h', orders: 18 },
    { hour: '10h', orders: 25 },
    { hour: '11h', orders: 42 },
    { hour: '12h', orders: 68 },
    { hour: '13h', orders: 55 },
    { hour: '14h', orders: 38 },
    { hour: '15h', orders: 28 },
    { hour: '16h', orders: 22 },
    { hour: '17h', orders: 35 },
    { hour: '18h', orders: 58 },
    { hour: '19h', orders: 72 },
    { hour: '20h', orders: 65 },
    { hour: '21h', orders: 45 },
    { hour: '22h', orders: 28 }
  ];

  const topProducts = [
    { name: 'Big Mac Combo', orders: 156, revenue: 'R$ 4.680,00' },
    { name: 'Pizza Margherita', orders: 134, revenue: 'R$ 7.098,00' },
    { name: 'Hambúrguer Artesanal', orders: 98, revenue: 'R$ 2.842,00' },
    { name: 'Sushi Combo 20pç', orders: 87, revenue: 'R$ 5.742,00' },
    { name: 'Açaí 500ml', orders: 76, revenue: 'R$ 1.444,00' }
  ];

  const periods = [
    { value: '1d', label: 'Hoje' },
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' }
  ];

  const marketplaces = [
    { value: 'all', label: 'Todos' },
    { value: 'Ifood', label: 'Ifood' },
    { value: 'rappi', label: 'Rappi' },
    { value: '99food', label: '99Food' },
    { value: 'keeta', label: 'Keeta' }
  ];

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'positive') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (changeType === 'negative') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Relatórios e Analytics
                </h1>
                <p className="text-xl text-slate-100">
                  Insights detalhados sobre seu negócio de delivery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Período:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Marketplace:</span>
              <select
                value={selectedMarketplace}
                onChange={(e) => setSelectedMarketplace(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {marketplaces.map(marketplace => (
                  <option key={marketplace.value} value={marketplace.value}>
                    {marketplace.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reportCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(card.changeType)}
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 
                      card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Marketplace Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-gray-600" />
                Distribuição por Marketplace
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {marketplaceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${item.value}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-600" />
                Pedidos por Hora
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {hourlyData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{item.hour}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.orders / 72) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 w-6">{item.orders}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-gray-600" />
              Produtos Mais Vendidos
            </h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Ver todos
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Produto</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Pedidos</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Receita</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {product.orders}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">
                      {product.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Relatório Detalhado</h3>
            </div>
            <p className="text-blue-100 mb-4">Gere um relatório completo com todos os dados do período selecionado.</p>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
              Gerar Relatório
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Análise de Tendências</h3>
            </div>
            <p className="text-green-100 mb-4">Identifique padrões e tendências para otimizar suas vendas.</p>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
              Ver Análise
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Metas e Objetivos</h3>
            </div>
            <p className="text-purple-100 mb-4">Configure metas de vendas e acompanhe seu progresso.</p>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
              Definir Metas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;