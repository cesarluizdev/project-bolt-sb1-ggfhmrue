import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit, Eye, Pause, Power, Trash2, Upload, Save, X, Check, Clock, DollarSign, Tag, Image as ImageIcon, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Loader, Settings, FolderSync as Sync, Globe, Star, Calendar, BarChart3 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  preparationTime: number;
  status: 'active' | 'inactive' | 'paused';
  image: string;
  stock?: number;
  tags: string[];
  marketplaces: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>([
    { id: '1', name: 'Hambúrguers', color: 'bg-red-100 text-red-800' },
    { id: '2', name: 'Pizzas', color: 'bg-orange-100 text-orange-800' },
    { id: '3', name: 'Bebidas', color: 'bg-blue-100 text-blue-800' },
    { id: '4', name: 'Sobremesas', color: 'bg-purple-100 text-purple-800' },
    { id: '5', name: 'Acompanhamentos', color: 'bg-green-100 text-green-800' },
    { id: '6', name: 'Salgados', color: 'bg-yellow-100 text-yellow-800' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    preparationTime: 0,
    status: 'active' as Product['status'],
    image: '',
    stock: 0,
    tags: [] as string[],
    syncWithMarketplaces: false,
    selectedMarketplaces: [] as string[]
  });

  const marketplaces = [
    { id: 'Ifood', name: 'Ifood', logo: '🍔', color: 'text-red-600' },
    { id: 'rappi', name: 'Rappi', logo: '🛵', color: 'text-orange-600' },
    { id: '99food', name: '99Food', logo: '🚗', color: 'text-yellow-600' },
    { id: 'keeta', name: 'Keeta', logo: '🏍️', color: 'text-purple-600' }
  ];

  const itemsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Big Mac Deluxe',
        description: 'Hambúrguer artesanal com carne 180g, queijo cheddar, alface, tomate e molho especial',
        category: 'Hambúrguers',
        price: 32.90,
        preparationTime: 15,
        status: 'active',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
        stock: 25,
        tags: ['artesanal', 'cheddar', 'premium'],
        marketplaces: ['Ifood', 'rappi'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Pizza Margherita',
        description: 'Pizza tradicional com molho de tomate, mussarela e manjericão fresco',
        category: 'Pizzas',
        price: 45.90,
        preparationTime: 25,
        status: 'active',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
        stock: 15,
        tags: ['tradicional', 'manjericão', 'italiana'],
        marketplaces: ['Ifood', '99food'],
        createdAt: '2024-01-14T14:00:00Z',
        updatedAt: '2024-01-14T14:00:00Z'
      },
      {
        id: '3',
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante Coca-Cola gelado',
        category: 'Bebidas',
        price: 6.50,
        preparationTime: 2,
        status: 'paused',
        image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300',
        stock: 50,
        tags: ['gelado', 'refrigerante'],
        marketplaces: ['Ifood', 'rappi', '99food'],
        createdAt: '2024-01-13T09:00:00Z',
        updatedAt: '2024-01-13T09:00:00Z'
      },
      {
        id: '4',
        name: 'Brownie com Sorvete',
        description: 'Brownie de chocolate quente com sorvete de baunilha e calda',
        category: 'Sobremesas',
        price: 18.90,
        preparationTime: 8,
        status: 'inactive',
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300',
        stock: 8,
        tags: ['chocolate', 'quente', 'sorvete'],
        marketplaces: [],
        createdAt: '2024-01-12T16:00:00Z',
        updatedAt: '2024-01-12T16:00:00Z'
      },
      {
        id: '5',
        name: 'Batata Frita Grande',
        description: 'Porção grande de batata frita crocante com sal especial',
        category: 'Acompanhamentos',
        price: 12.90,
        preparationTime: 10,
        status: 'active',
        image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=300',
        stock: 30,
        tags: ['crocante', 'sal especial', 'porção'],
        marketplaces: ['Ifood', 'rappi', '99food', 'keeta'],
        createdAt: '2024-01-11T11:00:00Z',
        updatedAt: '2024-01-11T11:00:00Z'
      }
    ];
    setProducts(mockProducts);
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'paused': return 'Pausado';
      default: return status;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || 'bg-gray-100 text-gray-800';
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateProduct = () => {
    setModalType('create');
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      preparationTime: 0,
      status: 'active',
      image: '',
      stock: 0,
      tags: [],
      syncWithMarketplaces: false,
      selectedMarketplaces: []
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setModalType('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      preparationTime: product.preparationTime,
      status: product.status,
      image: product.image,
      stock: product.stock || 0,
      tags: product.tags,
      syncWithMarketplaces: false,
      selectedMarketplaces: []
    });
    setShowModal(true);
  };

  const handleViewProduct = (product: Product) => {
    setModalType('view');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handlePauseProduct = async (productId: string) => {
    setSyncLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, status: product.status === 'paused' ? 'active' : 'paused' as Product['status'] }
          : product
      ));
      
      const product = products.find(p => p.id === productId);
      const action = product?.status === 'paused' ? 'reativado' : 'pausado';
      showNotification('success', `Produto ${action} em todos os marketplaces!`);
    } catch (error) {
      showNotification('error', 'Erro ao sincronizar com marketplaces');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleToggleStatus = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja alterar o status deste produto?')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' as Product['status'] }
            : product
        ));
        
        showNotification('success', 'Status do produto atualizado!');
      } catch (error) {
        showNotification('error', 'Erro ao atualizar produto');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category || !formData.image) {
      showNotification('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProduct: Product = {
        id: modalType === 'create' ? Date.now().toString() : selectedProduct!.id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        preparationTime: formData.preparationTime,
        status: formData.status,
        image: formData.image,
        stock: formData.stock,
        tags: formData.tags,
        marketplaces: formData.syncWithMarketplaces ? formData.selectedMarketplaces : [],
        createdAt: modalType === 'create' ? new Date().toISOString() : selectedProduct!.createdAt,
        updatedAt: new Date().toISOString()
      };

      if (modalType === 'create') {
        setProducts(prev => [newProduct, ...prev]);
        showNotification('success', 'Produto criado com sucesso!');
      } else {
        setProducts(prev => prev.map(p => p.id === newProduct.id ? newProduct : p));
        showNotification('success', 'Produto atualizado com sucesso!');
      }

      if (formData.syncWithMarketplaces && formData.selectedMarketplaces.length > 0) {
        setSyncLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification('success', `Produto sincronizado com ${formData.selectedMarketplaces.length} marketplace(s)!`);
        setSyncLoading(false);
      }

      setShowModal(false);
    } catch (error) {
      showNotification('error', 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestão de Produtos
                </h1>
                <p className="text-xl text-slate-100">
                  Gerencie seu cardápio e sincronize com os marketplaces
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateProduct}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Novo Produto
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou categoria..."
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
                <option value="paused">Pausado</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Produto</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Categoria</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Preço</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Marketplaces</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 truncate max-w-48">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <div className="text-xs text-gray-500">
                        {product.preparationTime} min
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-1">
                        {product.marketplaces.map(marketplace => {
                          const mp = marketplaces.find(m => m.id === marketplace);
                          return mp ? (
                            <span key={marketplace} className="text-lg" title={mp.name}>
                              {mp.logo}
                            </span>
                          ) : null;
                        })}
                        {product.marketplaces.length === 0 && (
                          <span className="text-xs text-gray-400">Não sincronizado</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePauseProduct(product.id)}
                          disabled={syncLoading}
                          className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                          title={product.status === 'paused' ? 'Reativar' : 'Pausar'}
                        >
                          {syncLoading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pause className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          disabled={loading}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title={product.status === 'active' ? 'Desativar' : 'Ativar'}
                        >
                          <Power className="h-4 w-4" />
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
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos
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
                  {modalType === 'create' && 'Novo Produto'}
                  {modalType === 'edit' && 'Editar Produto'}
                  {modalType === 'view' && 'Detalhes do Produto'}
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
              {modalType === 'view' && selectedProduct ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-gray-600">{selectedProduct.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Categoria</label>
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedProduct.category)}`}>
                              {selectedProduct.category}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProduct.status)}`}>
                              {getStatusText(selectedProduct.status)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Preço</label>
                          <div className="mt-1 text-lg font-semibold text-gray-900">
                            R$ {selectedProduct.price.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Tempo de Preparo</label>
                          <div className="mt-1 text-lg font-semibold text-gray-900">
                            {selectedProduct.preparationTime} min
                          </div>
                        </div>
                      </div>

                      {selectedProduct.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Tags</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {selectedProduct.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-600">Marketplaces Sincronizados</label>
                        <div className="mt-1 flex gap-2">
                          {selectedProduct.marketplaces.map(marketplace => {
                            const mp = marketplaces.find(m => m.id === marketplace);
                            return mp ? (
                              <div key={marketplace} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                <span className="text-lg">{mp.logo}</span>
                                <span className="text-sm font-medium">{mp.name}</span>
                              </div>
                            ) : null;
                          })}
                          {selectedProduct.marketplaces.length === 0 && (
                            <span className="text-sm text-gray-500">Nenhum marketplace sincronizado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Produto *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Ex: Big Mac Deluxe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Descreva o produto..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          >
                            <option value="">Selecione...</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Product['status'] }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="paused">Pausado</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço (R$) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tempo de Preparo (min)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.preparationTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="15"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estoque (opcional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Imagem do Produto *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                          {formData.image ? (
                            <div className="space-y-3">
                              <img
                                src={formData.image}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remover imagem
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                              <div>
                                <input
                                  type="url"
                                  value={formData.image}
                                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="URL da imagem"
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Cole a URL de uma imagem ou faça upload
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Digite uma tag e pressione Enter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                addTag(input.value.trim());
                                input.value = '';
                              }
                            }}
                          />
                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {formData.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-1"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-orange-900"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Marketplace Sync */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            id="syncMarketplaces"
                            checked={formData.syncWithMarketplaces}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              syncWithMarketplaces: e.target.checked,
                              selectedMarketplaces: e.target.checked ? prev.selectedMarketplaces : []
                            }))}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <label htmlFor="syncMarketplaces" className="text-sm font-medium text-gray-700">
                            Sincronizar com marketplaces
                          </label>
                        </div>

                        {formData.syncWithMarketplaces && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 mb-3">
                              Selecione os marketplaces para sincronização:
                            </p>
                            {marketplaces.map(marketplace => (
                              <label key={marketplace.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={formData.selectedMarketplaces.includes(marketplace.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        selectedMarketplaces: [...prev.selectedMarketplaces, marketplace.id]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        selectedMarketplaces: prev.selectedMarketplaces.filter(id => id !== marketplace.id)
                                      }));
                                    }
                                  }}
                                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-lg">{marketplace.logo}</span>
                                <span className="text-sm font-medium">{marketplace.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
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
                      disabled={loading || syncLoading}
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
                          {modalType === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
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

      {/* Sync Loading Overlay */}
      {syncLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Sync className="h-6 w-6 animate-spin text-orange-500" />
            <span className="text-lg font-medium">Sincronizando com marketplaces...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;