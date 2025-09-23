import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  User,
  Building,
  Star,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Download,
  FileText,
  TrendingUp,
  Heart,
  Award
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  birthDate?: string;
  registrationDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteMarketplace: string;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  preferences: {
    notifications: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    birthDate: '',
    notes: '',
    notifications: true,
    promotions: true,
    newsletter: false
  });

  const itemsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'João Silva Santos',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        address: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        birthDate: '1985-03-15',
        registrationDate: '2023-01-15T10:00:00Z',
        lastOrderDate: '2024-01-15T10:30:00Z',
        totalOrders: 47,
        totalSpent: 1580.50,
        averageOrderValue: 33.63,
        favoriteMarketplace: 'Ifood',
        status: 'vip',
        notes: 'Cliente VIP - sempre pontual nos pagamentos',
        preferences: {
          notifications: true,
          promotions: true,
          newsletter: true
        }
      },
      {
        id: '2',
        name: 'Maria Santos Oliveira',
        email: 'maria.santos@email.com',
        phone: '(21) 88888-8888',
        address: {
          street: 'Av. Copacabana',
          number: '456',
          neighborhood: 'Copacabana',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '22070-001'
        },
        registrationDate: '2023-05-20T14:00:00Z',
        lastOrderDate: '2024-01-14T19:45:00Z',
        totalOrders: 23,
        totalSpent: 890.30,
        averageOrderValue: 38.71,
        favoriteMarketplace: 'Rappi',
        status: 'active',
        preferences: {
          notifications: true,
          promotions: false,
          newsletter: false
        }
      },
      {
        id: '3',
        name: 'Carlos Oliveira Lima',
        email: 'carlos.oliveira@email.com',
        phone: '(31) 77777-7777',
        address: {
          street: 'Rua Central',
          number: '789',
          neighborhood: 'Savassi',
          city: 'Belo Horizonte',
          state: 'MG',
          zipCode: '30112-000'
        },
        birthDate: '1990-07-22',
        registrationDate: '2023-08-10T09:00:00Z',
        lastOrderDate: '2024-01-10T12:15:00Z',
        totalOrders: 15,
        totalSpent: 456.80,
        averageOrderValue: 30.45,
        favoriteMarketplace: '99Food',
        status: 'active',
        notes: 'Prefere pedidos no final de semana',
        preferences: {
          notifications: false,
          promotions: true,
          newsletter: false
        }
      },
      {
        id: '4',
        name: 'Ana Costa Ferreira',
        email: 'ana.costa@email.com',
        phone: '(85) 66666-6666',
        address: {
          street: 'Av. Beira Mar',
          number: '321',
          neighborhood: 'Meireles',
          city: 'Fortaleza',
          state: 'CE',
          zipCode: '60165-121'
        },
        registrationDate: '2023-11-05T16:30:00Z',
        lastOrderDate: '2023-12-20T20:00:00Z',
        totalOrders: 8,
        totalSpent: 234.60,
        averageOrderValue: 29.33,
        favoriteMarketplace: 'Ifood',
        status: 'inactive',
        preferences: {
          notifications: true,
          promotions: true,
          newsletter: true
        }
      },
      {
        id: '5',
        name: 'Pedro Ferreira Souza',
        email: 'pedro.ferreira@email.com',
        phone: '(47) 55555-5555',
        address: {
          street: 'Rua das Palmeiras',
          number: '654',
          complement: 'Casa 2',
          neighborhood: 'Centro',
          city: 'Blumenau',
          state: 'SC',
          zipCode: '89010-100'
        },
        birthDate: '1988-12-03',
        registrationDate: '2023-03-25T11:15:00Z',
        lastOrderDate: '2024-01-12T18:30:00Z',
        totalOrders: 31,
        totalSpent: 1120.40,
        averageOrderValue: 36.14,
        favoriteMarketplace: 'Rappi',
        status: 'active',
        notes: 'Cliente fiel - sempre avalia positivamente',
        preferences: {
          notifications: true,
          promotions: false,
          newsletter: true
        }
      }
    ];
    setCustomers(mockCustomers);
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'vip': return 'VIP';
      default: return status;
    }
  };

  const getMarketplaceEmoji = (marketplace: string) => {
    switch (marketplace) {
      case 'Ifood': return '🍔';
      case 'Rappi': return '🛵';
      case '99Food': return '🚗';
      case 'Keeta': return '🏍️';
      default: return '📱';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateCustomer = () => {
    setModalType('create');
    setFormData({
      name: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      birthDate: '',
      notes: '',
      notifications: true,
      promotions: true,
      newsletter: false
    });
    setShowModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setModalType('edit');
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      street: customer.address.street,
      number: customer.address.number,
      complement: customer.address.complement || '',
      neighborhood: customer.address.neighborhood,
      city: customer.address.city,
      state: customer.address.state,
      zipCode: customer.address.zipCode,
      birthDate: customer.birthDate || '',
      notes: customer.notes || '',
      notifications: customer.preferences.notifications,
      promotions: customer.preferences.promotions,
      newsletter: customer.preferences.newsletter
    });
    setShowModal(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setModalType('view');
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleSaveCustomer = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showNotification('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCustomer: Customer = {
        id: modalType === 'create' ? Date.now().toString() : selectedCustomer!.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        birthDate: formData.birthDate,
        registrationDate: modalType === 'create' ? new Date().toISOString() : selectedCustomer!.registrationDate,
        lastOrderDate: selectedCustomer?.lastOrderDate,
        totalOrders: selectedCustomer?.totalOrders || 0,
        totalSpent: selectedCustomer?.totalSpent || 0,
        averageOrderValue: selectedCustomer?.averageOrderValue || 0,
        favoriteMarketplace: selectedCustomer?.favoriteMarketplace || 'Ifood',
        status: selectedCustomer?.status || 'active',
        notes: formData.notes,
        preferences: {
          notifications: formData.notifications,
          promotions: formData.promotions,
          newsletter: formData.newsletter
        }
      };

      if (modalType === 'create') {
        setCustomers(prev => [newCustomer, ...prev]);
        showNotification('success', 'Cliente cadastrado com sucesso!');
      } else {
        setCustomers(prev => prev.map(c => c.id === newCustomer.id ? newCustomer : c));
        showNotification('success', 'Cliente atualizado com sucesso!');
      }

      setShowModal(false);
    } catch (error) {
      showNotification('error', 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total de Clientes', 
      value: customers.length.toString(), 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Clientes Ativos', 
      value: customers.filter(c => c.status === 'active').length.toString(), 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Clientes VIP', 
      value: customers.filter(c => c.status === 'vip').length.toString(), 
      icon: Award, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Ticket Médio', 
      value: formatCurrency(customers.reduce((acc, c) => acc + c.averageOrderValue, 0) / customers.length || 0), 
      icon: DollarSign, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestão de Clientes
                </h1>
                <p className="text-xl text-slate-100">
                  Gerencie sua base de clientes e relacionamento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button
                onClick={handleCreateCustomer}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Contato</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Localização</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Estatísticas</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-500">
                            Cliente desde {formatDate(customer.registrationDate)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{customer.address.city}, {customer.address.state}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{customer.totalOrders} pedidos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-green-600 font-medium">
                            {formatCurrency(customer.totalSpent)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">{getMarketplaceEmoji(customer.favoriteMarketplace)}</span>
                          <span className="text-gray-600">{customer.favoriteMarketplace}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Ligar"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} de {filteredCustomers.length} clientes
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
                    {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {modalType === 'create' && 'Novo Cliente'}
                  {modalType === 'edit' && 'Editar Cliente'}
                  {modalType === 'view' && 'Detalhes do Cliente'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalType === 'view' && selectedCustomer ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}>
                            {getStatusText(selectedCustomer.status)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{selectedCustomer.phone}</span>
                        </div>
                        {selectedCustomer.birthDate && (
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700">
                              Nascimento: {formatDate(selectedCustomer.birthDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Endereço</h4>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          <p>{selectedCustomer.address.street}, {selectedCustomer.address.number}</p>
                          {selectedCustomer.address.complement && <p>{selectedCustomer.address.complement}</p>}
                          <p>{selectedCustomer.address.neighborhood}</p>
                          <p>{selectedCustomer.address.city}, {selectedCustomer.address.state}</p>
                          <p>CEP: {selectedCustomer.address.zipCode}</p>
                        </div>
                      </div>

                      {selectedCustomer.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Observações</h4>
                          <p className="text-gray-700 text-sm">{selectedCustomer.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Statistics */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Estatísticas do Cliente</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                          <div className="text-sm text-blue-600">Total de Pedidos</div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(selectedCustomer.totalSpent)}
                          </div>
                          <div className="text-sm text-green-600">Total Gasto</div>
                        </div>
                        
                        <div className="bg-orange-50 rounded-lg p-4 text-center">
                          <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(selectedCustomer.averageOrderValue)}
                          </div>
                          <div className="text-sm text-orange-600">Ticket Médio</div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                          <span className="text-3xl mx-auto mb-2 block">
                            {getMarketplaceEmoji(selectedCustomer.favoriteMarketplace)}
                          </span>
                          <div className="text-lg font-bold text-purple-600">
                            {selectedCustomer.favoriteMarketplace}
                          </div>
                          <div className="text-sm text-purple-600">Marketplace Favorito</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Preferências de Comunicação</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            {selectedCustomer.preferences.notifications ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span>Notificações de pedidos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedCustomer.preferences.promotions ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span>Promoções e ofertas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedCustomer.preferences.newsletter ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span>Newsletter</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Cliente desde: {formatDate(selectedCustomer.registrationDate)}</p>
                        {selectedCustomer.lastOrderDate && (
                          <p>Último pedido: {formatDate(selectedCustomer.lastOrderDate)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={(e) => { e.preventDefault(); handleSaveCustomer(); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Informações Pessoais
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Nome completo do cliente"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="email@exemplo.com"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="(11) 99999-9999"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Observações sobre o cliente..."
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Endereço
                      </h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rua
                          </label>
                          <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Nome da rua"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número
                          </label>
                          <input
                            type="text"
                            value={formData.number}
                            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.complement}
                          onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Apto, bloco, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Nome do bairro"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cidade
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Nome da cidade"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <select
                            value={formData.state}
                            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="">Selecione...</option>
                            <option value="SP">São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="PR">Paraná</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="BA">Bahia</option>
                            <option value="GO">Goiás</option>
                            <option value="PE">Pernambuco</option>
                            <option value="CE">Ceará</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="00000-000"
                        />
                      </div>

                      {/* Preferences */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Preferências de Comunicação
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={formData.notifications}
                              onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Notificações de pedidos</span>
                          </label>
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={formData.promotions}
                              onChange={(e) => setFormData(prev => ({ ...prev, promotions: e.target.checked }))}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Promoções e ofertas</span>
                          </label>
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={formData.newsletter}
                              onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Newsletter</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {modalType === 'create' ? 'Cadastrar Cliente' : 'Salvar Alterações'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;