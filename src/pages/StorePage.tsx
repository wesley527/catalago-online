import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { CheckoutModal } from '../components/CheckoutModal';
import { Toast, useToast } from '../components/Toast';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import { useTheme } from '../contexts/ThemeContext';
import { Product, Category } from '../lib/types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast, showToast } = useToast();
  const { tenant } = useTenant();
  const { bannerUrl } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      if (!tenant?.id) {
        setLoading(false);
        return;
      }

      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(tenant.id),
          categoryService.getAllCategories(tenant.id),
        ]);
        setAllProducts(productsData);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        showToast('Erro ao carregar dados', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tenant?.id, showToast]);

  useEffect(() => {
    if (selectedCategory) {
      setProducts(allProducts.filter((p) => p.category_id === selectedCategory));
    } else {
      setProducts(allProducts);
    }
  }, [selectedCategory, allProducts]);

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

      {bannerUrl && (
        <div className="w-full h-64 overflow-hidden">
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          </div>
        ) : !tenant ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600 text-lg">Loja não encontrada</p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Produtos</h2>

              {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {products.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-600 text-lg">
                  {selectedCategory
                    ? 'Nenhum produto nesta categoria'
                    : 'Nenhum produto disponível no momento'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(quantity) => handleAddToCart(product, quantity)}
                  />
                ))}
              </div>
            )}
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
