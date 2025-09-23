import React from 'react';
import { ChefHat, Clock } from 'lucide-react';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const PreparingOrdersPage: React.FC = () => {
  const { orders, loading, error, updateOrderStatus } = useRealTimeOrders();
  
  // Filtrar apenas pedidos em preparo
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const [selectedOrder, setSelectedOrder] = React.useState(preparingOrders[0] || null);

  React.useEffect(() => {
    if (preparingOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(preparingOrders[0]);
    }
  }, [preparingOrders, selectedOrder]);

  const markReadyForDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'shipped');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos em preparo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico para pedidos em preparo */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pedidos em Preparo
              </h1>
              <p className="text-xl text-orange-100">
                {preparingOrders.length} pedidos sendo preparados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {preparingOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum pedido em preparo
            </h3>
            <p className="text-gray-500">
              Os pedidos em preparo aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-2/5">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {preparingOrders.length} pedidos em preparo
                </h2>
                <p className="text-gray-600">
                  Marque como "Pronto" quando finalizar o preparo
                </p>
              </div>
              <div className="space-y-4">
                {preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`
                      relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
                      hover:shadow-lg hover:-translate-y-1 hover:border-orange-300
                      ${selectedOrder?.id === order.id 
                        ? 'border-orange-400 shadow-lg -translate-y-1 bg-orange-50' 
                        : 'border-orange-200'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          order.marketplace === 'Rappi' ? 'bg-orange-500' :
                          order.marketplace === 'Ifood' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="font-medium text-slate-700">{order.marketplace}</span>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        Preparando
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2">#{order.orderNumber}</h3>
                    <p className="text-sm text-slate-600 mb-2">Cliente: {order.customer.name}</p>
                    <p className="text-lg font-semibold text-orange-600 mb-3">
                      R$ {order.total.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-10 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Iniciado: {new Date(order.orderDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Botão alinhado no canto inferior direito */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markReadyForDelivery(order.id);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        Marcar como Pronto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 hidden lg:block">
              <div className="sticky top-8">
                {selectedOrder && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedOrder.orderNumber}
                        </h3>
                        <p className="text-gray-600">
                          {selectedOrder.marketplace} - Em preparo
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Itens para Preparar</h4>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium text-orange-800">
                                    {item.quantity}x {item.name}
                                  </span>
                                  {item.observations && (
                                    <p className="text-xs text-orange-600 mt-1 font-medium">
                                      ⚠️ {item.observations}
                                    </p>
                                  )}
                                </div>
                                <span className="font-semibold text-orange-700">
                                  R$ {(item.quantity * item.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Tempo de Preparo</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">Estimado: 25-30 minutos</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        {/* Botão removido aqui para não duplicar */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreparingOrdersPage;
