import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Package, ShoppingBag, Tag, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { ProductManagement } from '../components/admin/ProductManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { NeighborhoodManagement } from '../components/admin/NeighborhoodManagement';
import TenantSettings from '../components/admin/TenantSettings';
import '../index.css';

type TabType = 'products' | 'orders' | 'categories' | 'neighborhoods';

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8">
            {[
              { id: 'products', label: '📦 Produtos' },
              { id: 'orders', label: '🛒 Pedidos' },
              { id: 'categories', label: '📂 Categorias' },
              { id: 'neighborhoods', label: '🏘️ Bairros' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-orange-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'neighborhoods' && <NeighborhoodManagement />}
      </div>
    </div>
  );
}
