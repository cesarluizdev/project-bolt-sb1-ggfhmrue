import { useState, useEffect, useCallback } from 'react';
import { Order } from '../types/Order';
import { OrderService } from '../services/orderService';
import { mockOrders } from '../data/mockOrders';

interface UseRealTimeOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

export const useRealTimeOrders = (refreshInterval: number = 5000): UseRealTimeOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      // Usando mockOrders por enquanto
      setOrders(mockOrders);

      // Futuro: substituir por API real
      // const fetchedOrders = await OrderService.getAllOrders();
      // setOrders(fetchedOrders);

    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptOrder = useCallback(async (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'confirmado' as Order['status'] } : order
      )
    );

    // Futuro: integração com API
    // try {
    //   const updatedOrder = await OrderService.acceptOrder(orderId);
    //   setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
    // } catch (err) {
    //   console.error('Erro ao aceitar pedido:', err);
    //   setError(err instanceof Error ? err.message : 'Erro ao aceitar pedido');
    // }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status } : order))
    );

    // Futuro: integração com API
    // try {
    //   const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
    //   setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
    // } catch (err) {
    //   console.error('Erro ao atualizar status:', err);
    //   setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
    // }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(refreshOrders, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshOrders, refreshInterval]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) refreshOrders();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders,
    acceptOrder,
    updateOrderStatus,
  };
};
