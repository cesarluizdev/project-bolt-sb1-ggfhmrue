import React, { useState, useEffect } from 'react';
import OrdersContent from '../components/OrdersContent';
import { Order } from '../types/Order';
import { mockOrders } from '../data/mockOrders';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';

const OrdersPage: React.FC = () => {
  // Para desenvolvimento, usar dados mock. Para produção, usar o hook de API
  const isDevelopment = import.meta.env.DEV;
  
  // Hook para dados em tempo real (produção)
  const { 
    orders: apiOrders,
    loading,
    error
  } = useRealTimeOrders(5000); // Atualiza a cada 30 segundos
  
  // Dados mock para desenvolvimento
  const [mockOrdersState, setMockOrdersState] = useState<Order[]>(mockOrders);

  // Escolher fonte de dados baseada no ambiente
  const orders = isDevelopment ? mockOrdersState : apiOrders;

  if (isDevelopment && loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (isDevelopment && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <OrdersContent
      orders={orders}
    />
  );
};

export default OrdersPage;