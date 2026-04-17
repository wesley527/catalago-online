import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import ProductForm from './ProductForm';
import Toast from '../Toast';
import { getProducts, deleteProduct } from '../../services/productService';
import type { Product } from '../../lib/types';

export default function ProductManagement() {
  const { tenant } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [tenant?.id]);

  const loadProducts = async () => {
    if (!tenant?.id) return;
    try {
      setLoading(true);
      const data = await getProducts(tenant.id);
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Erro ao deletar produto');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  if (loading && products.length === 0) {
    return <p className="text-center py-8">Carregando produtos...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          + Novo Produto
        </button>
      </div>

      {error && <Toast message={error} type="error" />}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
        />
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum produto cadastrado</p>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span>R$ {product.price.toFixed(2)}</span>
                  <span>Estoque: {product.stock}</span>
                  <span>{product.active ? '✅ Ativo' : '❌ Inativo'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
