/**
 * Exemplos de Uso dos Contextos
 * 
 * Este arquivo contém exemplos de como usar os hooks dos contextos
 * em seus componentes React.
 */

// ============================================
// 1. useAuth - Autenticação
// ============================================

import { useAuth } from './contexts/AuthContext';

function LoginExample() {
  const { user, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      console.log('Login realizado!');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    console.log('Logout realizado!');
  };

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    return (
      <button onClick={handleLogin}>
        Fazer Login
      </button>
    );
  }

  return (
    <div>
      <p>Bem-vindo, {user.email}!</p>
      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

// ============================================
// 2. useCart - Carrinho de Compras
// ============================================

import { useCart } from './contexts/CartContext';
import type { CartItem } from './lib/types';

function CartExample() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCart();

  const handleAddToCart = () => {
    const item: CartItem = {
      product_id: '123',
      name: 'Produto Exemplo',
      price: 99.99,
      quantity: 1,
      image_url: 'https://...',
    };
    addItem(item);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    console.log('Total:', total);
    // Prosseguir para checkout
  };

  return (
    <div>
      <h2>Carrinho ({items.length} itens)</h2>
      {items.map((item) => (
        <div key={item.product_id}>
          <p>{item.name}</p>
          <p>R$ {item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleUpdateQuantity(item.product_id, parseInt(e.target.value))
            }
          />
          <button onClick={() => handleRemoveItem(item.product_id)}>
            Remover
          </button>
        </div>
      ))}
      <p>Total: R$ {total.toFixed(2)}</p>
      <button onClick={handleCheckout}>Finalizar Compra</button>
      <button onClick={clearCart}>Limpar Carrinho</button>
    </div>
  );
}

// ============================================
// 3. useTenant - Gerenciamento de Lojas
// ============================================

import { useTenant } from './contexts/TenantContext';
import type { Tenant } from './lib/types';

function TenantExample() {
  const { tenant, tenants, setTenant, loading } = useTenant();

  const handleSelectTenant = (selectedTenant: Tenant) => {
    setTenant(selectedTenant);
  };

  if (loading) return <div>Carregando lojas...</div>;

  return (
    <div>
      <p>Loja Atual: {tenant?.name}</p>
      
      <select onChange={(e) => {
        const selected = tenants.find((t) => t.id === e.target.value);
        if (selected) handleSelectTenant(selected);
      }}>
        <option>Selecione uma loja</option>
        {tenants.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {tenant && (
        <div>
          <img src={tenant.logo_url} alt={tenant.name} />
          <p>Slug: {tenant.slug}</p>
          <p>Tema: {tenant.theme}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// 4. useTheme - Tema Claro/Escuro
// ============================================

import { useTheme } from './contexts/ThemeContext';

function ThemeExample() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      <p>Tema Atual: {theme}</p>
      
      <button onClick={toggleTheme}>
        Alternar Tema
      </button>

      <button onClick={() => setTheme('light')}>
        Tema Claro
      </button>

      <button onClick={() => setTheme('dark')}>
        Tema Escuro
      </button>
    </div>
  );
}

// ============================================
// 5. Usando Múltiplos Contextos
// ============================================

import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { useTenant } from './contexts/TenantContext';
import { useTheme } from './contexts/ThemeContext';

function CompleteExample() {
  const { user, logout } = useAuth();
  const { items, total, clearCart } = useCart();
  const { tenant } = useTenant();
  const { theme } = useTheme();

  const handleCheckout = async () => {
    if (!user || !tenant) {
      console.error('Usuário ou loja não selecionada');
      return;
    }

    console.log('Processando checkout...');
    console.log('Usuário:', user.email);
    console.log('Loja:', tenant.name);
    console.log('Itens:', items);
    console.log('Total:', total);

    // Aqui você faria a chamada para a API
    // await createOrder({ ... });

    clearCart();
    console.log('Pedido criado com sucesso!');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <h1>Checkout - {tenant?.name}</h1>
      <p>Usuário: {user?.email}</p>
      <p>Itens no carrinho: {items.length}</p>
      <p>Total: R$ {total.toFixed(2)}</p>
      
      <button onClick={handleCheckout}>
        Finalizar Compra
      </button>
      
      <button onClick={logout}>
        Sair
      </button>
    </div>
  );
}

// ============================================
// 6. Dicas Importantes
// ============================================

/**
 * ✅ DOs (O que você DEVE fazer)
 * 
 * - Use os hooks dentro de componentes que estão dentro do Provider
 * - Memoize callbacks complexos com useCallback
 * - Use useMemo para otimizar re-renders desnecessários
 * - Combine contextos para lógica complexa
 * - Sempre trate possíveis valores null/undefined
 */

/**
 * ❌ DON'Ts (O que você NÃO DEVE fazer)
 * 
 * - Não use hooks fora de componentes React
 * - Não chame hooks condicionalmente
 * - Não use hooks dentro de loops
 * - Não esqueça de envolver sua app com os Providers
 * - Não ignore erros de contexto não encontrado
 */

export {};
