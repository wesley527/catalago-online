import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { Cart } from '../components/Cart'
import { CheckoutModal } from '../components/CheckoutModal'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'{ useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { CheckoutModal } from '../components/CheckoutModal';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useTenant } from '../contexts/TenantContext';
import type { Product, Category } from '../lib/types';

export default function StorePage() {
  const { tenant } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!tenant?.id) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(tenant.id),
          getCategories(tenant.id),
        ]);

        if (!cancelled) {
          setProducts(productsData);
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [tenant?.id]);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categorias</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">Carregando produtos...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              Nenhum produto encontrado nesta categoria.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Checkout */}
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-bold mb-4">Carrinho</h3>
          <Cart />
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full mt-4 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
          >
            Finalizar Compra
          </button>
        </div>
      </main>

      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  );
}
