import { Order } from '../types/Order';

// Configuração da API
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api',
  endpoints: {
    orders: '/orders',
    rappi: '/orders/rappi',
    Ifood: '/orders/Ifood',
    food99: '/orders/99food'
  }
};

// Serviço para buscar pedidos
export class OrderService {
  private static async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Buscar todos os pedidos
  static async getAllOrders(): Promise<Order[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar pedidos: ${response.status}`);
      }
      
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw new Error('Falha ao carregar pedidos. Verifique sua conexão.');
    }
  }

  // Buscar pedidos por marketplace
  static async getOrdersByMarketplace(marketplace: 'Rappi' | 'Ifood' | '99Food'): Promise<Order[]> {
    try {
      let endpoint = '';
      switch (marketplace) {
        case 'Rappi':
          endpoint = API_CONFIG.endpoints.rappi;
          break;
        case 'Ifood':
          endpoint = API_CONFIG.endpoints.Ifood;
          break;
        case '99Food':
          endpoint = API_CONFIG.endpoints.food99;
          break;
      }

      const response = await this.fetchWithTimeout(`${API_CONFIG.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar pedidos do ${marketplace}: ${response.status}`);
      }
      
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error(`Erro ao buscar pedidos do ${marketplace}:`, error);
      throw new Error(`Falha ao carregar pedidos do ${marketplace}.`);
    }
  }

  // Atualizar status do pedido
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders}/${orderId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar pedido: ${response.status}`);
      }
      
      const updatedOrder = await response.json();
      return updatedOrder;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw new Error('Falha ao atualizar status do pedido.');
    }
  }

  // Aceitar pedido
  static async acceptOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'confirmed');
  }

  // Iniciar preparo
  static async startPreparation(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'preparing');
  }

  // Marcar como pronto para entrega
  static async markReadyForDelivery(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'shipped');
  }

  // Marcar como entregue
  static async markDelivered(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'delivered');
  }

  // Cancelar pedido
  static async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }
}

// Hook personalizado para gerenciar pedidos
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOrders = await OrderService.getAllOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const updatedOrder = await OrderService.acceptOrder(orderId);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aceitar pedido');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
    }
  };

  return {
    orders,
    loading,
    error,
    loadOrders,
    acceptOrder,
    updateOrderStatus,
  };
};

// Adicionar import do useState
import { useState } from 'react';