import React, { useEffect, useState } from 'react';
import { ShoppingCart, Loader } from 'lucide-react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { CheckoutModal } from '../components/CheckoutModal';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useTenant } from '../contexts/TenantContext';
import { useCart } from '../contexts/CartContext';
import type { Product, Category } from '../lib/types';

export default function StorePage() {
  const { tenant } = useTenant();
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!tenant?.id) {
        setError('Loja não encontrada');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(tenant.id),
          categoryService.getAllCategories(tenant.id),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar produtos';
        setError(message);
        console.error('[StorePage] Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tenant?.id]);

  const filteredProducts =
    selectedCategory && selectedCategory !== 'all'
      ? products.filter((p) => p.category_id === selectedCategory)
      : products;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando loja...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onCartClick={() => setCartOpen(true)} cartCount={items.length} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtro de Categorias */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid de Produtos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto disponível'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Carrinho Lateral */}
      {cartOpen && (
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCheckoutOpen(true);
            setCartOpen(false);
          }}
        />
      )}

      {/* Modal de Checkout */}
      {checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            alert('Pedido criado com sucesso!');
            setCheckoutOpen(false);
          }}
        />
      )}
    </div>
  );
}
