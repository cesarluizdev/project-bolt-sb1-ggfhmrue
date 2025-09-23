import React from 'react';
import { Package, Clock } from 'lucide-react';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const PendingOrdersPage: React.FC = () => {
  const { orders, loading } = useRealTimeOrders();

  // Filtrar apenas pedidos pendentes
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const [selectedOrder, setSelectedOrder] = React.useState(pendingOrders[0] || null);

  React.useEffect(() => {
    if (pendingOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(pendingOrders[0]);
    }
  }, [pendingOrders, selectedOrder]);

  const acceptOrder = (orderId: string) => {
    console.log(`Pedido ${orderId} aceito`);
    // Aqui você pode integrar com a API futuramente
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos pendentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pedidos Pendentes
              </h1>
              <p className="text-xl text-orange-100">
                {pendingOrders.length} pedidos aguardando aceite
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum pedido pendente
            </h3>
            <p className="text-gray-500">
              Os pedidos pendentes aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Lista de pedidos */}
            <div className="w-2/5">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {pendingOrders.length} pedidos pendentes
                </h2>
                <p className="text-gray-600">
                  Aceite os pedidos abaixo para iniciar o preparo
                </p>
              </div>
              <div className="space-y-4">
                {pendingOrders.map((order) => (
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
                        Pendente
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2">#{order.orderNumber}</h3>
                    <p className="text-sm text-slate-600 mb-2">Cliente: {order.customer.name}</p>
                    <p className="text-lg font-semibold text-orange-600 mb-10">
                      R$ {order.total.toFixed(2)}
                    </p>

                    {/* Botão fixo no canto inferior direito */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptOrder(order.id);
                      }}
                      className="absolute bottom-3 right-3 bg-orange-500 hover:bg-orange-600 text-white font-medium py-1.5 px-3 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-md text-sm"
                    >
                      Aceitar
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
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedOrder.orderNumber}
                        </h3>
                        <p className="text-gray-600">
                          {selectedOrder.marketplace} - Aguardando aceite
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Itens do Pedido</h4>
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
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-orange-600">R$ {selectedOrder.total.toFixed(2)}</span>
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

export default PendingOrdersPage;
