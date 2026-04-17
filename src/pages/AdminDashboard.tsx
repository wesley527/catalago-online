<<<<<<< HEAD
import React, { useState } from 'react';
import { LogOut, Menu, X, BarChart3, Package, Truck, Settings, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import DeliveryAreaManagement from '../components/admin/DeliveryAreaManagement';
import OrderManagement from '../components/admin/OrderManagement';
import TenantSettings from '../components/admin/TenantSettings';
import '../index.css';

type TabType = 'products' | 'categories' | 'orders' | 'delivery' | 'settings';
=======
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Package, ShoppingBag, Tag, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useNavigate } from 'react-router-dom';
import { ProductManagement } from '../components/admin/ProductManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { NeighborhoodManagement } from '../components/admin/NeighborhoodManagement';

type TabType = 'products' | 'orders' | 'categories' | 'neighborhoods';
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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

<<<<<<< HEAD
  const tabs = [
    { id: 'products' as TabType, label: 'Produtos', icon: Package },
    { id: 'categories' as TabType, label: 'Categorias', icon: List },
    { id: 'delivery' as TabType, label: 'Áreas de Entrega', icon: Truck },
    { id: 'orders' as TabType, label: 'Pedidos', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'delivery':
        return <DeliveryAreaManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'settings':
        return <TenantSettings />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tenant.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard Administrativo</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Plano {tenant.plan}</p>
=======
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 flex-wrap">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produtos
            </div>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categorias
            </div>
          </button>
          <button
            onClick={() => setActiveTab('neighborhoods')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'neighborhoods'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Bairros
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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
<<<<<<< HEAD
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
=======
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Pedidos
            </div>
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
          </button>
        </div>

<<<<<<< HEAD
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex flex-col gap-2 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
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
                    <Icon className="w-5 h-5" />
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
              const Icon = tab.icon;
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
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderTabContent()}</main>
      </div>
=======
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'neighborhoods' && <NeighborhoodManagement />}
        {activeTab === 'orders' && <OrderManagement />}
      </main>
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
    </div>
  );
}
