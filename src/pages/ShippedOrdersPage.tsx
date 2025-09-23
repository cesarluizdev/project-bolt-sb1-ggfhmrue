import React from 'react';
import { BikeIcon, MapPin } from 'lucide-react';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const ShippedOrdersPage: React.FC = () => {
  const { orders, loading, error, updateOrderStatus } = useRealTimeOrders();
  
  // Filtrar apenas pedidos enviados
  const shippedOrders = orders.filter(order => order.status === 'shipped');
  const [selectedOrder, setSelectedOrder] = React.useState(shippedOrders[0] || null);

  React.useEffect(() => {
    if (shippedOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(shippedOrders[0]);
    }
  }, [shippedOrders, selectedOrder]);

  const markAsDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos enviados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico para pedidos enviados */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <BikeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pedidos Enviados
              </h1>
              <p className="text-xl text-purple-100">
                {shippedOrders.length} pedidos a caminho do cliente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shippedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BikeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum pedido enviado
            </h3>
            <p className="text-gray-500">
              Os pedidos prontos para entrega aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-2/5">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {shippedOrders.length} pedidos enviados
                </h2>
                <p className="text-gray-600">
                  Acompanhe a entrega e confirme quando entregue
                </p>
              </div>
              <div className="space-y-4">
                {shippedOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`
                      relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
                      hover:shadow-lg hover:-translate-y-1 hover:border-purple-300
                      ${selectedOrder?.id === order.id 
                        ? 'border-purple-400 shadow-lg -translate-y-1 bg-purple-50' 
                        : 'border-purple-200'
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        Enviado
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2">#{order.orderNumber}</h3>
                    <p className="text-sm text-slate-600 mb-2">Cliente: {order.customer.name}</p>
                    <p className="text-lg font-semibold text-purple-600 mb-3">
                      R$ {order.total.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-12 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{order.deliveryAddress.street}</span>
                    </div>
                    
                    {/* Botão alinhado no canto inferior direito */}
                    <div className="absolute bottom-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsDelivered(order.id);
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Detalhes do pedido */}
            <div className="flex-1 hidden lg:block">
              <div className="sticky top-8">
                {selectedOrder && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BikeIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedOrder.orderNumber}
                        </h3>
                        <p className="text-gray-600">
                          {selectedOrder.marketplace} - A caminho
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Status da Entrega</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">Pedido preparado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-purple-700 font-medium">Saiu para entrega</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500">Aguardando confirmação</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Endereço de Entrega</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm">
                            {selectedOrder.deliveryAddress.street}<br/>
                            {selectedOrder.deliveryAddress.complement && `${selectedOrder.deliveryAddress.complement}<br/>`}
                            {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}<br/>
                            CEP: {selectedOrder.deliveryAddress.zipCode}
                          </p>
                          {selectedOrder.deliveryAddress.reference && (
                            <p className="text-orange-600 text-sm mt-2 font-medium">
                              📍 {selectedOrder.deliveryAddress.reference}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contato do Cliente</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-700">{selectedOrder.customer.name}</p>
                          {selectedOrder.customer.phone && (
                            <p className="text-blue-600 font-medium">{selectedOrder.customer.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold mb-4">
                          <span>Total:</span>
                          <span className="text-purple-600">R$ {selectedOrder.total.toFixed(2)}</span>
                        </div>
                        {/* Removi o botão grande daqui */}
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

export default ShippedOrdersPage;
