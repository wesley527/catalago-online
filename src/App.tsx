import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { TenantProvider } from './contexts/TenantContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import StorePage from './pages/StorePage';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Analisando arquivo

function App() {
  useEffect(() => {
    // Prevent layout shift by adjusting viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <CartProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/" element={<Navigate to="/store" replace />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Router>
          </CartProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
