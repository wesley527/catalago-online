import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { CheckoutModal } from '../components/CheckoutModal';
import { Toast, useToast } from '../components/Toast';
import { useCart } from '../contexts/CartContext';
import { Product } from '../lib/types';
import { productService } from '../services/productService';

export const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast, showToast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        showToast('Erro ao carregar produtos', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [showToast]);

  const handleAddToCart = (product: Product, quantity: number) => {
    try {
      addToCart(product, quantity);
      showToast(`${product.name} adicionado ao carrinho!`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar ao carrinho';
      showToast(message, 'error');
    }
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    showToast('Pedido realizado com sucesso! Abrindo WhatsApp...', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600 text-lg">Nenhum produto disponível no momento</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossos Produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(quantity) => handleAddToCart(product, quantity)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckoutClick} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {toast && <Toast {...toast} />}
    </div>
  );
};
