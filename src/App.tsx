import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import OrdersPage from './pages/OrdersPage';
import PendingOrdersPage from './pages/PendingOrdersPage';
import ConfirmedOrdersPage from './pages/ConfirmedOrdersPage';
import PreparingOrdersPage from './pages/PreparingOrdersPage';
import ShippedOrdersPage from './pages/ShippedOrdersPage';
import DeliveredOrdersPage from './pages/DeliveredOrdersPage';
import CancelledOrdersPage from './pages/CancelledOrdersPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import ProductsManager from './pages/ProductsManager';
import CustomersPage from './pages/CustomersPage';
import HelpPage from './pages/HelpPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário logado, mostrar landing page ou login
  if (!user) {
    if (showLogin) {
      return <LoginPage onBackToLanding={() => setShowLogin(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowLogin(true)} />;
  }

  // Se tem usuário logado, mostrar o sistema
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/pending" element={
          <ProtectedRoute>
            <PendingOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/confirmed" element={
          <ProtectedRoute>
            <ConfirmedOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/preparing" element={
          <ProtectedRoute>
            <PreparingOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/shipped" element={
          <ProtectedRoute>
            <ShippedOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/delivered" element={
          <ProtectedRoute>
            <DeliveredOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/cancelled" element={
          <ProtectedRoute>
            <CancelledOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsManager />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;