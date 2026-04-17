import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { getCategories } from '../../services/categoryService';
import Toast from '../Toast';
import type { Product, Category } from '../../lib/types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { tenant } = useTenant();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    category_id: product?.category_id || '',
    image_url: product?.image_url || '',
    active: product?.active ?? true,
  });

  useEffect(() => {
    loadCategories();
  }, [tenant?.id]);

  const loadCategories = async () => {
    if (!tenant?.id) return;
    try {
      const data = await getCategories(tenant.id);
      setCategories(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onClose();
    } catch (err) {
      setError('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="text-sm font-medium text-gray-700">Ativo</span>
            </label>
          </div>

          {error && <Toast message={error} type="error" />}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

