import React from 'react';
import OrderCard from './OrderCard';
import { Order } from '../types/Order';

interface OrderListProps {
  orders: Order[];
  selectedOrder: Order | null;
  onOrderSelect: (order: Order) => void;
  onAcceptOrder?: (orderId: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedOrder,
  onOrderSelect,
  onAcceptOrder,
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
        <p className="text-gray-400">Aguardando novos pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isSelected={selectedOrder?.id === order.id}
          onClick={() => onOrderSelect(order)}
          onAcceptOrder={onAcceptOrder}
        />
      ))}
    </div>
  );
};

export default OrderList;