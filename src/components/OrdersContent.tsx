import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, ChefHat, CheckCircle2, XCircle, ArrowRight, BikeIcon } from 'lucide-react';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const OrdersContent: React.FC = () => {
  const { orders, refreshOrders, acceptOrder, updateOrderStatus, loading, error } = useRealTimeOrders(5000);

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  const pendingCount = getStatusCount('pending');

  // Referências para áudio e contador anterior
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingCountRef = useRef<number>(pendingCount);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/alert.mp3');
      audioRef.current.loop = true;
    }

    // Tocar áudio apenas quando houver novos pedidos pendentes
    if (pendingCount > 0 && pendingCount > pendingCountRef.current) {
      audioRef.current.play().catch(() => {
        console.warn('Interação do usuário necessária para tocar áudio.');
      });
    }

    // Pausar áudio quando não houver pendentes
    if (pendingCount === 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    pendingCountRef.current = pendingCount;
  }, [pendingCount]);

  const statusPages = [
    { status: 'pending', title: 'Pendentes', icon: Clock, color: 'from-yellow-600 to-orange-600', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', path: '/orders/pending', description: 'Aguardando confirmação' },
    { status: 'confirmed', title: 'Confirmados', icon: CheckCircle, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-100', textColor: 'text-blue-800', path: '/orders/confirmed', description: 'Prontos para preparo' },
    { status: 'preparing', title: 'Preparando', icon: ChefHat, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-100', textColor: 'text-orange-800', path: '/orders/preparing', description: 'Em produção' },
    { status: 'shipped', title: 'Enviados', icon: BikeIcon, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-100', textColor: 'text-purple-800', path: '/orders/shipped', description: 'A caminho do cliente' },
    { status: 'delivered', title: 'Entregues', icon: CheckCircle2, color: 'from-green-600 to-green-700', bgColor: 'bg-green-100', textColor: 'text-green-800', path: '/orders/delivered', description: 'Finalizados' },
    { status: 'cancelled', title: 'Cancelados', icon: XCircle, color: 'from-red-600 to-red-700', bgColor: 'bg-red-100', textColor: 'text-red-800', path: '/orders/cancelled', description: 'Cancelados' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={refreshOrders} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header e Status Summary */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Monitor de Pedidos</h1>
          <p className="text-xl text-slate-100">Todos os pedidos dos principais marketplaces e food delivery reunidos em um painel único, atualizado em tempo real</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
            {statusPages.map((statusPage) => {
              const count = getStatusCount(statusPage.status);
              const Icon = statusPage.icon;
              const isUrgent = statusPage.status === 'pending' && count > 0;

              return (
                <Link
                  key={statusPage.status}
                  to={statusPage.path}
                  className={`rounded-lg p-4 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                    isUrgent
                      ? 'bg-orange-500/20 border-2 border-orange-400 animate-pulse shadow-lg shadow-orange-500/25'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-6 w-6 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className={`text-sm ${isUrgent ? 'text-orange-200 font-semibold' : 'text-slate-100'}`}>
                    {statusPage.title} {isUrgent && '⚠️'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statusPages.map((statusPage) => {
            const count = getStatusCount(statusPage.status);
            const Icon = statusPage.icon;

            return (
              <Link
                key={statusPage.status}
                to={statusPage.path}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${statusPage.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{statusPage.title}</h3>
                      <p className="text-white/80 text-sm">{statusPage.description}</p>
                    </div>
                    <Icon className="h-10 w-10 text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
                      <div className="text-gray-600 text-sm">{count === 1 ? 'pedido' : 'pedidos'}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  {count > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusPage.bgColor} ${statusPage.textColor}`}>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        Requer atenção
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersContent;
