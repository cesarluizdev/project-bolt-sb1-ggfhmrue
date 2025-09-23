import React from 'react';
import { Package, MapPin, Calendar, User, CreditCard, Building2, DollarSign, Clock, BikeIcon, Phone, Mail, FileText, ShoppingBag } from 'lucide-react';
import { Order } from '../types/Order';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{order.orderNumber}</h2>
            <p className="text-slate-100 font-medium">{order.marketplace} - {order.restaurant.name}</p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span>{order.customer.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(order.orderDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
            <DollarSign className="h-4 w-4 text-orange-500" />
            <span>Total: {formatCurrency(order.total)} (Taxa: {formatCurrency(order.deliveryFee)})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <span>{order.paymentMethod}</span>
          </div>
        </div>

        {/* Status and Tracking */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Clock className="h-3 w-3 inline mr-1" />
            Entrega: {new Date(order.estimatedDelivery).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Restaurant Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <Building2 className="h-3 w-3 inline mr-1" />
            {order.restaurant.name}
          </span>
          {order.restaurant.phone && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Phone className="h-3 w-3 inline mr-1" />
              {order.restaurant.phone}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {/* Customer Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Informações do Cliente</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{order.customer.email}</span>
            </div>
            {order.customer.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{order.customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Itens do Pedido ({order.items.length})</h3>
          </div>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  )}
                  {item.observations && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">Obs: {item.observations}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {item.quantity}x {formatCurrency(item.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Total: {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h3>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>{order.deliveryAddress.street}</p>
            {order.deliveryAddress.complement && <p>{order.deliveryAddress.complement}</p>}
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
            <p>CEP: {order.deliveryAddress.zipCode}</p>
            {order.deliveryAddress.reference && (
              <p className="text-orange-600 font-medium mt-1">Referência: {order.deliveryAddress.reference}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Observações</h3>
            </div>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2">
              <Package className="h-4 w-4" />
              Aceitar Pedido
            </button>
            <button className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2">
              <BikeIcon className="h-4 w-4" />
              Iniciar Preparo
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button className="border border-gray-300 hover:border-slate-400 hover:bg-slate-50 text-gray-700 py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 text-sm">
              Ligar Cliente
            </button>
            <button className="border border-gray-300 hover:border-slate-400 hover:bg-slate-50 text-gray-700 py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 text-sm">
              Imprimir
            </button>
            <button className="border border-gray-300 hover:border-slate-400 hover:bg-slate-50 text-gray-700 py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;