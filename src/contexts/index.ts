/**
 * Índice de Hooks Disponíveis
 */

// Auth
export { AuthProvider, useAuth } from './AuthContext';
// Uso: const { user, login, logout, loading } = useAuth();

// Cart
export { CartProvider, useCart } from './CartContext';
// Uso: const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCart();

// Tenant
export { TenantProvider, useTenant } from './TenantContext';
// Uso: const { tenant, tenants, setTenant, loading } = useTenant();

// Theme
export { useTheme } from './ThemeContext';
// Uso: const { theme, toggleTheme, setTheme } = useTheme();
