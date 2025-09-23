import React from 'react';
import { CheckCircle, Play } from 'lucide-react';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const ConfirmedOrdersPage: React.FC = () => {
  const { orders, loading, error, updateOrderStatus } = useRealTimeOrders();
  
  // Filtrar apenas pedidos confirmados
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const [selectedOrder, setSelectedOrder] = React.useState(confirmedOrders[0] || null);

  React.useEffect(() => {
    if (confirmedOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(confirmedOrders[0]);
    }
  }, [confirmedOrders, selectedOrder]);

  const startPreparation = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos confirmados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico para pedidos confirmados */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pedidos Confirmados
              </h1>
              <p className="text-xl text-blue-100">
                {confirmedOrders.length} pedidos prontos para preparo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {confirmedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum pedido confirmado
            </h3>
            <p className="text-gray-500">
              Os pedidos confirmados aparecerão aqui para iniciar o preparo.
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-2/5">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {confirmedOrders.length} pedidos confirmados
                </h2>
                <p className="text-gray-600">
                  Clique em "Iniciar Preparo" para começar a produção
                </p>
              </div>
              <div className="space-y-4">
                {confirmedOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`
                      relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
                      hover:shadow-lg hover:-translate-y-1 hover:border-blue-300
                      ${selectedOrder?.id === order.id 
                        ? 'border-blue-400 shadow-lg -translate-y-1 bg-blue-50' 
                        : 'border-blue-200'
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Confirmado
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2">#{order.orderNumber}</h3>
                    <p className="text-sm text-slate-600 mb-2">Cliente: {order.customer.name}</p>
                    <p className="text-lg font-semibold text-blue-600 mb-10">
                      R$ {order.total.toFixed(2)}
                    </p>
                    
                    {/* Botão fixo no canto inferior direito */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startPreparation(order.id);
                      }}
                      className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-3 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-md text-sm flex items-center gap-1.5"
                    >
                      <Play className="h-4 w-4" />
                      Preparo
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Detalhes do pedido selecionado */}
            <div className="flex-1 hidden lg:block">
              <div className="sticky top-8">
                {selectedOrder && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedOrder.orderNumber}
                        </h3>
                        <p className="text-gray-600">
                          {selectedOrder.marketplace} - Confirmado
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                        <p className="text-gray-700">{selectedOrder.customer.name}</p>
                        <p className="text-gray-600 text-sm">{selectedOrder.customer.email}</p>
                        {selectedOrder.customer.phone && (
                          <p className="text-gray-600 text-sm">{selectedOrder.customer.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Itens ({selectedOrder.items.length})</h4>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between">
                                <span className="font-medium">{item.quantity}x {item.name}</span>
                                <span className="font-semibold">R$ {(item.quantity * item.price).toFixed(2)}</span>
                              </div>
                              {item.observations && (
                                <p className="text-xs text-orange-600 mt-1">Obs: {item.observations}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Endereço de Entrega</h4>
                        <p className="text-gray-700 text-sm">
                          {selectedOrder.deliveryAddress.street}<br/>
                          {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}<br/>
                          CEP: {selectedOrder.deliveryAddress.zipCode}
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-blue-600">R$ {selectedOrder.total.toFixed(2)}</span>
                        </div>
                        {/* Removido o botão duplicado aqui */}
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

export default ConfirmedOrdersPage;
