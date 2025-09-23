import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Settings, BarChart3, Users, LogOut, HelpCircle, ListChecks, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png'; // <- importando o novo logo

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = [
    { name: 'Pedidos', href: '/', icon: Package, current: location.pathname === '/' },
    { name: 'Produtos', href: '/products', icon: List, current: location.pathname === '/products' },
    { name: 'Configurações', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
    { name: 'Relatórios', href: '/reports', icon: BarChart3, current: location.pathname === '/reports' },
    { name: 'Clientes', href: '/customers', icon: Users, current: location.pathname === '/customers' },
    { name: 'Ajuda', href: '/help', icon: HelpCircle, current: location.pathname === '/help' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Novo logo */}
              <img src={logo} alt="Logo" className="h-14 w-auto mr-3" />
              <span className="text-2xl font-bold text-slate-800">Zentro Solution</span>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.current
                          ? 'border-orange-500 text-slate-900'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Olá, {user?.user_metadata?.full_name || user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-4 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1 - Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="Logo" className="h-10 mb-3" />
            <p className="text-sm">
              © {new Date().getFullYear()} One IT Services LTDA  
              <br /> CNPJ 62.521.611/0001-32  
              <br /> Todos os direitos reservados.
            </p>
          </div>

          {/* Coluna 2 - Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-3">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Pedidos</Link></li>
              <li><Link to="/reports" className="hover:text-white">Relatórios</Link></li>
              <li><Link to="/settings" className="hover:text-white">Configurações</Link></li>
              <li><Link to="/help" className="hover:text-white">Ajuda</Link></li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-semibold mb-3">Contato</h4>
            <p className="text-sm">
              Email: contato@oneitservices.com.br <br />
              Tel: (11) 99999-9999
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 py-4 text-center text-xs text-gray-500">
          Desenvolvido por One IT Services
        </div>
      </footer>
    </div>
  );
};

export default Layout;
