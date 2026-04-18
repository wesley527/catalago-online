import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Package, ShoppingBag, Tag, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useNavigate } from 'react-router-dom';
import { ProductManagement } from '../components/admin/ProductManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { NeighborhoodManagement } from '../components/admin/NeighborhoodManagement';
import TenantSettings from '../components/admin/TenantSettings';
import '../index.css';

type TabType = 'products' | 'orders' | 'categories' | 'neighborhoods' | 'settings';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    void supabase.auth.refreshSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg">Loja não encontrada</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'products', label: 'Produtos' },
    { id: 'categories', label: 'Categorias' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'neighborhoods', label: 'Bairros' },
    { id: 'settings', label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tenant.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard Administrativo</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Plano {tenant.plan}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex flex-col gap-2 mb-4">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar - Desktop only */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-20 h-[calc(100vh-80px)]">
          <nav className="p-6 space-y-2">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'neighborhoods' && <NeighborhoodManagement />}
          {activeTab === 'settings' && <TenantSettings />}
        </main>
      </div>
    </div>
  );
}
