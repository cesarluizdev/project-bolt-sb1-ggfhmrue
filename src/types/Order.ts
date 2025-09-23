export interface Order {
  id: string;
  orderNumber: string;
  marketplace: 'Rappi' | 'Ifood' | '99Food';
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    description?: string;
    observations?: string;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
    reference?: string;
  };
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery: string;
  deliveryFee: number;
  notes?: string;
  restaurant: {
    name: string;
    phone?: string;
  };
}