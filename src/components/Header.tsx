import React from 'react';
import { ShoppingCart, LogIn, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
}

export default function Header({ onCartClick, cartCount }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-orange-600">🛒 Catálogo Online</h1>
=======
          {logoUrl ? (
            <img src={logoUrl} alt={tenant?.name || 'Logo'} className="h-10 w-auto object-contain" />
          ) : (
            <Store className="w-8 h-8 text-blue-600" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {tenant?.name || 'Super Sexy - Magazine'}
          </h1>
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {user && (
            <>
              <span className="text-sm">
                Olá, <strong>{user.email}</strong>
              </span>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Admin
                </button>
              )}
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            } hover:opacity-80 transition-opacity`}
            title="Alternar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
