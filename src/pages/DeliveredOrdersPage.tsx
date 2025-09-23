import React from 'react';
import { CheckCircle2, Star, Calendar } from 'lucide-react';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const DeliveredOrdersPage: React.FC = () => {
  const { orders, loading } = useRealTimeOrders();
  
  // Filtrar apenas pedidos entregues
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const [selectedOrder, setSelectedOrder] = React.useState(deliveredOrders[0] || null);

  React.useEffect(() => {
    if (deliveredOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(deliveredOrders[0]);
    }
  }, [deliveredOrders, selectedOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos entregues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico para pedidos entregues */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pedidos Entregues
              </h1>
              <p className="text-xl text-green-100">
                {deliveredOrders.length} pedidos finalizados com sucesso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {deliveredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum pedido entregue hoje
            </h3>
            <p className="text-gray-500">
              Os pedidos entregues aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-2/5">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {deliveredOrders.length} pedidos entregues
                </h2>
                <p className="text-gray-600">
                  Histórico de entregas realizadas
                </p>
              </div>
              <div className="space-y-4">
                {deliveredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`
                      bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
                      hover:shadow-lg hover:-translate-y-1 hover:border-green-300
                      ${selectedOrder?.id === order.id 
                        ? 'border-green-400 shadow-lg -translate-y-1 bg-green-50' 
                        : 'border-green-200'
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Entregue
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2">#{order.orderNumber}</h3>
                    <p className="text-sm text-slate-600 mb-2">Cliente: {order.customer.name}</p>
                    <p className="text-lg font-semibold text-green-600 mb-3">
                      R$ {order.total.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Entregue: {new Date(order.orderDate).toLocaleDateString('pt-BR')}</span>
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
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedOrder.orderNumber}
                        </h3>
                        <p className="text-gray-600">
                          {selectedOrder.marketplace} - Entregue com sucesso
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Pedido Finalizado</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          Entregue em {new Date(selectedOrder.orderDate).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(selectedOrder.orderDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Resumo do Pedido</h4>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-medium">R$ {(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                        <p className="text-gray-700">{selectedOrder.customer.name}</p>
                        <p className="text-gray-600 text-sm">{selectedOrder.customer.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Endereço de Entrega</h4>
                        <p className="text-gray-700 text-sm">
                          {selectedOrder.deliveryAddress.street}<br/>
                          {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold mb-4">
                          <span>Total Pago:</span>
                          <span className="text-green-600">R$ {selectedOrder.total.toFixed(2)}</span>
                        </div>
                        
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">Avaliação do Cliente</span>
                          </div>
                          <p className="text-yellow-700 text-sm">
                            Aguardando avaliação do cliente no marketplace
                          </p>
                        </div>
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

export default DeliveredOrdersPage;