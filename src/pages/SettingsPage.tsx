import React, {
    useState,
    useEffect
} from 'react';
import {
    Settings,
    Key,
    Save,
    TestTube,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    Plus,
    Building,
    Code,
    Link,
    Copy,
    ExternalLink,
    Trash2,
    Loader2,
} from 'lucide-react';
interface MarketplaceConfig {
    id: string;
    name: string;
    logo: string;
    color: string;
    bgColor: string;
    isConnected: boolean;
    lastSync: string | null;
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    orderCount: number;
    config ? : {
        storeId ? : string; // editable (Ifood)
        validationCode ? : string; // display-only (Ifood)
        bindingCode ? : string; // generated / copyable (Ifood)
        apiKey ? : string;
        webhookUrl ? : string;
    };
}
const SettingsPage: React.FC = () => {
    // ---------- initial state (mocked) ----------
    const [marketplaces, setMarketplaces] = useState < MarketplaceConfig[] > ([{
        id: 'Ifood',
        name: 'Ifood',
        logo: '/ifood-seeklogo.png',
        color: 'text-red-600',
        bgColor: 'bg-red-600',
        isConnected: false,
        lastSync: null,
        status: 'disconnected',
        orderCount: 0,
        config: {
            storeId: '',
            validationCode: '',
            bindingCode: '',
            webhookUrl: 'https://api.exemplo.com/webhook/Ifood'
        }
    }, {
        id: 'rappi',
        name: 'Rappi',
        logo: '🛵',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        isConnected: true,
        lastSync: '2024-01-15T10:25:00Z',
        status: 'connected',
        orderCount: 23,
        config: {
            apiKey: 'rappi_api_key_***************',
            webhookUrl: 'https://api.exemplo.com/webhook/rappi'
        }
    }, {
        id: '99food',
        name: '99Food',
        logo: '🚗',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        isConnected: false,
        lastSync: null,
        status: 'disconnected',
        orderCount: 0,
        config: {
            apiKey: '',
            webhookUrl: 'https://api.exemplo.com/webhook/99food'
        }
    }, {
        id: 'keeta',
        name: 'Keeta',
        logo: '🏍️',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        isConnected: false,
        lastSync: null,
        status: 'disconnected',
        orderCount: 0,
        config: {
            apiKey: '',
            webhookUrl: 'https://api.exemplo.com/webhook/keeta'
        }
    }]);
    const [selectedMarketplaceId, setSelectedMarketplaceId] = useState < string > ('Ifood');
    const selectedMarketplace = marketplaces.find(m => m.id === selectedMarketplaceId) || null;
    // UI state
    const [editingField, setEditingField] = useState < string | null > (null);
    const [tempValue, setTempValue] = useState < string > ('');
    const [notification, setNotification] = useState < {
        type: 'success' | 'error';message: string
    } | null > (null);
    const [isLoadingValidation, setIsLoadingValidation] = useState(false);
    const [isGeneratingBinding, setIsGeneratingBinding] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [showApiKeys, setShowApiKeys] = useState < {
        [key: string]: boolean
    } > ({});
    // ---------- helpers ----------
    const formatLastSync = (dateString: string | null) => {
        if (!dateString) return 'Nunca sincronizado';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'testing':
                return <RefreshCw className="h-5 w-5 text-orange-500 animate-spin" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-400" />;
        }
    };
    const getStatusText = (status: string) => {
        switch (status) {
            case 'connected':
                return 'Conectado';
            case 'error':
                return 'Erro';
            case 'testing':
                return 'Testando...';
            default:
                return 'Desconectado';
        }
    };
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({
            type,
            message
        });
        setTimeout(() => setNotification(null), 3500);
    };
    // ---------- CRUD UI helpers ----------
    const startEditing = (field: string, currentValue = '') => {
        setEditingField(field);
        setTempValue(currentValue);
    };
    const cancelEditing = () => {
        setEditingField(null);
        setTempValue('');
    };
    const saveField = (field: string) => {
        if (!selectedMarketplace) return;
        setMarketplaces(prev => prev.map(mp => mp.id === selectedMarketplace.id ? {
            ...mp,
            config: {
                ...mp.config,
                [field]: tempValue
            },
            // if storeId set, consider it a possible connected flag (simplified)
            isConnected: field === 'apiKey' || field === 'storeId' ? tempValue.length > 0 : mp.isConnected
        } : mp));
        setEditingField(null);
        setTempValue('');
        showNotification('success', 'Campo atualizado com sucesso!');
    };
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('success', 'Copiado para a área de transferência!');
        } catch (err) {
            showNotification('error', 'Não foi possível copiar');
        }
    };
    // ---------- Ifood specific flows ----------
    // Simula chamada API para buscar código de validação a partir do storeId
    const handleGenerateValidationCode = async () => {
        if (!selectedMarketplace || !selectedMarketplace.config?.storeId?.trim()) {
            showNotification('error', 'Informe o ID da loja antes de gerar o código');
            return;
        }
        setIsLoadingValidation(true);
        try {
            // Simulação: aqui você chamaria sua API backend que conversa com Ifood
            await new Promise(res => setTimeout(res, 1200));
            const validationCode = `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
            setMarketplaces(prev => prev.map(mp => mp.id === selectedMarketplace.id ? {
                ...mp,
                config: {
                    ...mp.config,
                    validationCode
                }
            } : mp));
            showNotification('success', 'Código de validação gerado');
        } catch (err) {
            console.error(err);
            showNotification('error', 'Erro ao gerar código de validação');
        } finally {
            setIsLoadingValidation(false);
        }
    };
    // Simula geração de código de vínculo (binding code)
    const generateBindingCode = async () => {
        if (!selectedMarketplace || !selectedMarketplace.config?.storeId) {
            showNotification('error', 'Configure o ID da loja primeiro');
            return;
        }
        setIsGeneratingBinding(true);
        try {
            await new Promise(res => setTimeout(res, 900));
            const bindingCode = `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
            setMarketplaces(prev => prev.map(mp => mp.id === selectedMarketplace.id ? {
                ...mp,
                config: {
                    ...mp.config,
                    bindingCode
                }
            } : mp));
            showNotification('success', 'Código de vínculo gerado');
        } catch (err) {
            console.error(err);
            showNotification('error', 'Erro ao gerar código de vínculo');
        } finally {
            setIsGeneratingBinding(false);
        }
    };
    // Testa conexão / sincroniza (simulação)
    const testConnection = async (marketplaceId: string) => {
        setIsTestingConnection(true);
        setMarketplaces(prev => prev.map(mp => mp.id === marketplaceId ? {
            ...mp,
            status: 'testing'
        } : mp));
        try {
            await new Promise(res => setTimeout(res, 1100));
            setMarketplaces(prev => prev.map(mp => {
                if (mp.id !== marketplaceId) return mp;
                const hasCreds = !!(mp.config?.apiKey || mp.config?.storeId || mp.config?.bindingCode);
                return {
                    ...mp,
                    status: hasCreds ? 'connected' : 'error',
                    lastSync: hasCreds ? new Date().toISOString() : mp.lastSync,
                    isConnected: hasCreds
                };
            }));
            showNotification('success', 'Sincronização finalizada');
        } catch (err) {
            console.error(err);
            showNotification('error', 'Erro ao sincronizar');
        } finally {
            setIsTestingConnection(false);
        }
    };
    // Add / remove marketplace helpers
    const addMarketplace = () => {
        const newMarketplace: MarketplaceConfig = {
            id: `marketplace_${Date.now()}`,
            name: 'Novo Marketplace',
            logo: '📱',
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            isConnected: false,
            lastSync: null,
            status: 'disconnected',
            orderCount: 0,
            config: {
                apiKey: '',
                webhookUrl: ''
            }
        };
        setMarketplaces(prev => [...prev, newMarketplace]);
        setSelectedMarketplaceId(newMarketplace.id);
        showNotification('success', 'Marketplace adicionado');
    };
    const removeMarketplace = (id: string) => {
        if (!window.confirm('Remover marketplace?')) return;
        setMarketplaces(prev => prev.filter(p => p.id !== id));
        if (selectedMarketplaceId === id) {
            setSelectedMarketplaceId(marketplaces[0]?.id || '');
        }
        showNotification('success', 'Marketplace removido');
    };
    // Toggle show API key
    const toggleShowApiKey = (id: string) => {
        setShowApiKeys(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    // ---------- effects ----------
    useEffect(() => {
        // Ensure selectedMarketplaceId exists
        if (!marketplaces.find(m => m.id === selectedMarketplaceId) && marketplaces.length > 0) {
            setSelectedMarketplaceId(marketplaces[0].id);
        }
    }, [marketplaces, selectedMarketplaceId]);
    // ---------- render ----------
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Configurações do Sistema
                </h1>
                <p className="text-xl text-slate-100">
                  Gerencie as conexões com os marketplaces de delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left column - list of marketplaces */}
          <aside className="w-2/5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Marketplaces Conectados</h2>
              {/* 
<button
  onClick={addMarketplace}
  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
>
  <Plus className="h-4 w-4" /> Adicionar
</button>
*/}

            </div>

            <div className="space-y-4">
              {marketplaces.map(mp => {
                const active = mp.id === selectedMarketplaceId;
                return (
                  <div
                    key={mp.id}
                    onClick={() => setSelectedMarketplaceId(mp.id)}
                    className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${active ? 'border-slate-400 shadow-lg' : 'border-gray-200'} hover:shadow-md`}
                    aria-current={active ? 'true' : undefined}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`${mp.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                          {mp.logo.endsWith('.png') || mp.logo.endsWith('.jpg') || mp.logo.endsWith('.svg') ? (
                            <img src={mp.logo} alt={mp.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-2xl">{mp.logo}</span>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-lg text-slate-800">{mp.name}</div>
                          <div className="text-sm text-slate-500">Marketplace de delivery</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(mp.status)}
                        {mp.id !== 'Ifood' && mp.id !== 'rappi' && mp.id !== '99food' && mp.id !== 'keeta' && (
                          <button onClick={(e) => { e.stopPropagation(); removeMarketplace(mp.id); }} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-slate-600">Status</div>
                        <div className="font-medium text-slate-800">{getStatusText(mp.status)}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Pedidos hoje</div>
                        <div className="font-semibold text-slate-800">{mp.orderCount}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Última sync</div>
                        <div className="text-xs text-slate-500">{formatLastSync(mp.lastSync)}</div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); testConnection(mp.id); }}
                          disabled={mp.status === 'testing'}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                        >
                          {mp.status === 'testing' ? 'Testando...' : 'Testar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right column - configuration panel */}
          <section className="flex-1">
            {selectedMarketplace ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className={`${selectedMarketplace.bgColor} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      {selectedMarketplace.logo.endsWith('.png') || selectedMarketplace.logo.endsWith('.jpg') || selectedMarketplace.logo.endsWith('.svg') ? (
                        <img src={selectedMarketplace.logo} alt={selectedMarketplace.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-3xl">{selectedMarketplace.logo}</span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white">Configuração — {selectedMarketplace.name}</h2>
                      <p className="text-white">Ajuste a integração com {selectedMarketplace.name}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* --- Ifood: interface totalmente focada e melhorada --- */}
                  {selectedMarketplace.id === 'Ifood' ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">Integração OAuth2 — Ifood</span>
                        </div>
                        <p className="text-blue-700 text-sm">
                          Configure Ifood em quatro passos: ID da loja → código de validação → autorização no Portal do Parceiro → código de vínculo.
                        </p>
                      </div>

                      {/* ID da Loja (editável) + botão gerar código de validação */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Building className="h-4 w-4 inline mr-2" />
                          ID da Loja (UUID)
                        </label>
                        <div className="flex gap-2">
                          {editingField === 'storeId' ? (
                            <>
                              <input
                                aria-label="ID da Loja"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                              />
                              <button onClick={() => saveField('storeId')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                                <Save className="h-4 w-4" />
                              </button>
                              <button onClick={cancelEditing} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">✕</button>
                            </>
                          ) : (
                            <>
                              <input
                                aria-label="ID da Loja"
                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-slate-600"
                                value={selectedMarketplace.config?.storeId || ''}
                                readOnly
                                placeholder="Insira o UUID da loja"
                              />
                              <button onClick={() => startEditing('storeId', selectedMarketplace.config?.storeId || '')} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">Editar</button>

                              <button
                                onClick={handleGenerateValidationCode}
                                disabled={isLoadingValidation || !selectedMarketplace.config?.storeId?.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                title="Gerar código de validação a partir do ID da loja"
                              >
                                {isLoadingValidation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
                                {isLoadingValidation ? 'Gerando...' : 'Gerar Código de Validação'}
                              </button>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">UUID único da loja fornecido pelo Ifood</p>
                      </div>

                      {/* Código de Validação (display-only) */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Code className="h-4 w-4 inline mr-2" /> Código de Validação
                        </label>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={selectedMarketplace.config?.validationCode || ''}
                            placeholder="Ainda não gerado"
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-slate-700"
                            aria-readonly
                          />
                          <button
                            onClick={() => copyToClipboard(selectedMarketplace.config?.validationCode || '')}
                            disabled={!selectedMarketplace.config?.validationCode}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            aria-label="Copiar código de validação"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Preenchido automaticamente após gerar.</p>
                      </div>

                      {/* Código de Vínculo (binding code) */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Link className="h-4 w-4 inline mr-2" /> Código de Vínculo
                        </label>
                        <div className="flex gap-2">
                          <input
                            aria-label="Código de Vínculo"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-slate-700"
                            value={selectedMarketplace.config?.bindingCode || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setMarketplaces(prev =>
                                prev.map(mp =>
                                  mp.id === selectedMarketplace.id
                                    ? { ...mp, config: { ...mp.config, bindingCode: newValue } }
                                    : mp
                                )
                              );
                            }}
                            placeholder="Insira ou edite o código de vínculo"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Código para autorizar o app no Portal do Parceiro Ifood.
                        </p>
                      </div>

                      {/* Actions: Sincronizar / Portal */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                          onClick={() => testConnection(selectedMarketplace.id)}
                          disabled={isTestingConnection}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                          {isTestingConnection ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                          {isTestingConnection ? 'Sincronizando...' : 'Sincronizar'}
                        </button>

                        <a
                          href="https://portal.Ifood.com.br"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" /> Portal do Parceiro
                        </a>
                      </div>

                      {/* Instructions when bindingCode exists */}
                      {selectedMarketplace.config?.bindingCode && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-green-800">Próximos passos</span>
                          </div>
                          <ol className="text-green-700 text-sm space-y-1 list-decimal list-inside">
                            <li>Acesse o <a href="https://portal.Ifood.com.br" target="_blank" rel="noreferrer" className="text-blue-600 underline">Portal do Parceiro Ifood</a></li>
                            <li>Autorize novo aplicativo e use o código de vínculo acima</li>
                            <li>Após autorizar, você receberá o código de autorização — cole-o na integração</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* --- Other marketplaces unchanged but presented nicely --- */
                    <div className="space-y-6">
                      <div className={`${selectedMarketplace.bgColor} border border-gray-200 rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="h-5 w-5 text-slate-600" />
                          <span className="font-semibold text-slate-800">Integração {selectedMarketplace.name}</span>
                        </div>
                        <p className="text-slate-700 text-sm">Configure a chave de API para integração com {selectedMarketplace.name}.</p>
                      </div>

                      {/* API Key */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Key className="h-4 w-4 inline mr-2" /> Chave da API
                        </label>
                        <div className="flex gap-2">
                          {editingField === 'apiKey' ? (
                            <>
                              <input className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                              <button onClick={() => saveField('apiKey')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"><Save className="h-4 w-4" /></button>
                              <button onClick={cancelEditing} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">✕</button>
                            </>
                          ) : (
                            <>
                              <input readOnly className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg" value={selectedMarketplace.config?.apiKey || ''} />
                              <button onClick={() => startEditing('apiKey', selectedMarketplace.config?.apiKey || '')} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">Editar</button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Webhook */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL do Webhook</label>
                        <div className="flex gap-2">
                          <input readOnly className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg" value={selectedMarketplace.config?.webhookUrl || ''} />
                          <button onClick={() => copyToClipboard(selectedMarketplace.config?.webhookUrl || '')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"><Copy className="h-4 w-4" /></button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => testConnection(selectedMarketplace.id)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                          <TestTube className="h-4 w-4" /> Testar Conexão
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Connection summary */}
                  <div className="mt-2 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Status da Conexão</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between"><span className="text-slate-600">Status:</span><span className={`font-medium ${selectedMarketplace.status === 'connected' ? 'text-green-600' : selectedMarketplace.status === 'error' ? 'text-red-600' : 'text-slate-500'}`}>{getStatusText(selectedMarketplace.status)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Pedidos hoje:</span><span className="font-medium text-slate-800">{selectedMarketplace.orderCount}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Última sync:</span><span className="text-xs text-slate-500">{formatLastSync(selectedMarketplace.lastSync)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Conexão:</span><span className={`font-medium ${selectedMarketplace.isConnected ? 'text-green-600' : 'text-red-600'}`}>{selectedMarketplace.isConnected ? 'Ativa' : 'Inativa'}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecione um Marketplace</h3>
                <p className="text-gray-500">Clique em um marketplace à esquerda para configurar a integração.</p>
              </div>
            )}
          </section>
        </div>

        {/* Help / Instructions */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-800 mb-2">Como configurar as integrações</h3>
              <div className="text-sm text-orange-700 space-y-2">
                <p><strong>Ifood:</strong> Preencha o ID da Loja, gere o código de validação e depois gere o código de vínculo. Autorize no Portal do Parceiro.</p>
                <p><strong>Rappi/99Food/Keeta:</strong> Configure chave de API e webhook conforme solicitado por cada plataforma.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>);
};
export default SettingsPage;