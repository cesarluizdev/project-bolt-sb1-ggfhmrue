import React from 'react';
import { Clock, MapPin, Phone, DollarSign } from 'lucide-react';
import { Order } from '../types/Order';

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
  onAcceptOrder: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isSelected, onClick, onAcceptOrder }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparando': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'enviado': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'entregue': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace) {
      case 'Rappi': return 'bg-orange-500';
      case 'Ifood': return 'bg-red-500';
      case '99Food': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAcceptOrder(order.id);
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-300
        hover:shadow-lg hover:-translate-y-1 hover:border-slate-300
        ${isSelected 
          ? 'border-slate-400 shadow-lg -translate-y-1 bg-slate-50' 
          : 'border-gray-200 hover:shadow-slate-200'
        }
      `}
    >
      {/* Header com Marketplace e Status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getMarketplaceColor(order.marketplace)}`}></div>
          <span className="font-medium text-slate-700">{order.marketplace}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Número do Pedido */}
      <div className="mb-2">
        <h3 className="font-bold text-lg text-slate-800">#{order.orderNumber}</h3>
      </div>

      {/* Restaurante */}
      <div className="mb-3">
        <p className="font-semibold text-slate-700">{order.restaurant.name}</p>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Phone className="w-3 h-3" />
          <span>{order.restaurant.phone}</span>
        </div>
      </div>

      {/* Cliente */}
      <div className="mb-3">
        <p className="text-sm text-slate-600">Cliente: <span className="font-medium">{order.customer.name}</span></p>
      </div>

      {/* Localização */}
      <div className="flex items-center gap-1 mb-3 text-sm text-slate-500">
        <MapPin className="w-4 h-4" />
        <span className="truncate">{order.deliveryAddress.street}, {order.deliveryAddress.number}</span>
      </div>

      {/* Valor e Taxa */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-orange-600">R$ {order.total.toFixed(2)}</span>
        </div>
        <span className="text-sm text-slate-500">Taxa: R$ {order.deliveryFee.toFixed(2)}</span>
      </div>

      {/* Horário */}
      <div className="flex items-center gap-1 mb-4 text-sm text-slate-500">
        <Clock className="w-4 h-4" />
        <span>{new Date(order.createdAt).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}</span>
        {order.estimatedDeliveryTime && (
          <span className="ml-2 text-orange-600 font-medium">
            Entrega: {order.estimatedDeliveryTime}
          </span>
        )}
      </div>

      {/* Botão de Aceitar (apenas para pedidos pendentes) */}
      {order.status === 'pendente' && (
        <button
          onClick={handleAcceptClick}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          Aceitar
        </button>
      )}
    </div>
  );
};

export default OrderCard;