import { Order } from '../types/Order';

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'RPP-2024-001',
    marketplace: 'Rappi',
    customer: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - Apto 45'
    },
    status: 'confirmed',
    total: 45.90,
    items: [
      {
        name: 'Big Mac + Batata Grande + Coca 500ml',
        quantity: 1,
        price: 32.90,
        description: 'Combo Big Mac completo',
        observations: 'Sem cebola'
      },
      {
        name: 'McFlurry Ovomaltine',
        quantity: 1,
        price: 13.00,
        description: 'Sobremesa gelada'
      }
    ],
    deliveryAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      complement: 'Apto 45',
      reference: 'Próximo ao mercado'
    },
    paymentMethod: 'PIX',
    orderDate: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-15T11:15:00Z',
    deliveryFee: 5.90,
    restaurant: {
      name: 'McDonald\'s - Shopping Center',
      phone: '(11) 3333-4444'
    }
  },
  {
    id: '2',
    orderNumber: 'IF-2024-002',
    marketplace: 'Ifood',
    customer: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(21) 88888-8888'
    },
    status: 'confirmed',
    total: 67.80,
    items: [
      {
        name: 'Pizza Margherita Grande',
        quantity: 1,
        price: 52.90,
        description: 'Pizza tradicional com manjericão'
      },
      {
        name: 'Refrigerante 2L',
        quantity: 2,
        price: 7.45,
        description: 'Coca-Cola 2 litros'
      }
    ],
    deliveryAddress: {
      street: 'Av. Copacabana, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22070-001',
      complement: 'Casa 2'
    },
    paymentMethod: 'Cartão de Crédito',
    orderDate: '2024-01-14T14:20:00Z',
    estimatedDelivery: '2024-01-14T15:30:00Z',
    deliveryFee: 7.90,
    restaurant: {
      name: 'Pizzaria Bella Napoli',
      phone: '(21) 2222-3333'
    }
  },
  {
    id: '3',
    orderNumber: '99F-2024-003',
    marketplace: '99Food',
    customer: {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com'
    },
    status: 'preparing',
    total: 38.50,
    items: [
      {
        name: 'Hambúrguer Artesanal',
        quantity: 1,
        price: 28.90,
        description: 'Hambúrguer 180g com queijo e bacon',
        observations: 'Ponto da carne: mal passado'
      },
      {
        name: 'Batata Rústica',
        quantity: 1,
        price: 9.60,
        description: 'Porção individual'
      }
    ],
    deliveryAddress: {
      street: 'Rua Central, 789',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30112-000',
      reference: 'Portão azul'
    },
    paymentMethod: 'Dinheiro',
    orderDate: '2024-01-13T09:15:00Z',
    estimatedDelivery: '2024-01-13T10:00:00Z',
    deliveryFee: 4.50,
    restaurant: {
      name: 'Burger House',
      phone: '(31) 4444-5555'
    }
  },
  {
    id: '4',
    orderNumber: 'RPP-2024-004',
    marketplace: 'Rappi',
    customer: {
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '(31) 77777-7777'
    },
    status: 'delivered',
    total: 72.40,
    items: [
      {
        name: 'Combo Sushi 20 peças',
        quantity: 1,
        price: 65.90,
        description: 'Mix de sushis e sashimis'
      },
      {
        name: 'Temaki Salmão',
        quantity: 1,
        price: 6.50,
        description: 'Temaki tradicional'
      }
    ],
    deliveryAddress: {
      street: 'Rua Minas Gerais, 321',
      city: 'Contagem',
      state: 'MG',
      zipCode: '32010-010',
      complement: 'Bloco B, Apto 201'
    },
    paymentMethod: 'Cartão de Crédito',
    orderDate: '2024-01-12T16:45:00Z',
    estimatedDelivery: '2024-01-12T17:30:00Z',
    deliveryFee: 8.90,
    restaurant: {
      name: 'Sushi Zen',
      phone: '(31) 5555-6666'
    }
  },
  {
    id: '5',
    orderNumber: 'IF-2024-005',
    marketplace: 'Ifood',
    customer: {
      name: 'Pedro Ferreira',
      email: 'pedro.ferreira@email.com',
      phone: '(85) 66666-6666'
    },
    status: 'cancelled',
    total: 29.90,
    items: [
      {
        name: 'Açaí 500ml',
        quantity: 1,
        price: 18.90,
        description: 'Açaí tradicional',
        observations: 'Com granola e banana'
      },
      {
        name: 'Água 500ml',
        quantity: 1,
        price: 3.00,
        description: 'Água mineral'
      }
    ],
    deliveryAddress: {
      street: 'Av. Beira Mar, 654',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60165-121',
      reference: 'Em frente à praia'
    },
    paymentMethod: 'PIX',
    orderDate: '2024-01-10T11:30:00Z',
    estimatedDelivery: '2024-01-10T12:15:00Z',
    deliveryFee: 8.00,
    restaurant: {
      name: 'Açaí do Ceará',
      phone: '(85) 7777-8888'
    }
  },
  {
    id: '5',
    orderNumber: 'IF-2024-005',
    marketplace: 'Ifood',
    customer: {
      name: 'Pedro Ferreira',
      email: 'pedro.ferreira@email.com',
      phone: '(85) 66666-6666'
    },
    status: 'shipped',
    total: 29.90,
    items: [
      {
        name: 'Açaí 500ml',
        quantity: 1,
        price: 18.90,
        description: 'Açaí tradicional',
        observations: 'Com granola e banana'
      },
      {
        name: 'Água 500ml',
        quantity: 1,
        price: 3.00,
        description: 'Água mineral'
      }
    ],
    deliveryAddress: {
      street: 'Av. Beira Mar, 654',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60165-121',
      reference: 'Em frente à praia'
    },
    paymentMethod: 'PIX',
    orderDate: '2024-01-10T11:30:00Z',
    estimatedDelivery: '2024-01-10T12:15:00Z',
    deliveryFee: 8.00,
    restaurant: {
      name: 'Açaí do Ceará',
      phone: '(85) 7777-8888'
    }
  }
];