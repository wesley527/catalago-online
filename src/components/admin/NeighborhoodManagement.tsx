import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import Toast from '../Toast';
import { getNeighborhoods, deleteNeighborhood } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../lib/types';

export default function NeighborhoodManagement() {
  const { tenant } = useTenant();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    zip_codes: '',
    delivery_fee: 0,
    active: true,
  });

  useEffect(() => {
    loadNeighborhoods();
  }, [tenant?.id]);

  const loadNeighborhoods = async () => {
    if (!tenant?.id) return;
    try {
      setLoading(true);
      const data = await getNeighborhoods(tenant.id);
      setNeighborhoods(data);
    } catch (err) {
      setError('Erro ao carregar bairros');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'delivery_fee'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFormData({ name: '', zip_codes: '', delivery_fee: 0, active: true });
      setEditingNeighborhood(null);
      setShowForm(false);
      loadNeighborhoods();
    } catch (err) {
      setError('Erro ao salvar bairro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este bairro?')) return;
    try {
      await deleteNeighborhood(id);
      setNeighborhoods((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError('Erro ao deletar bairro');
    }
  };

  const handleEdit = (neighborhood: Neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setFormData({
      name: neighborhood.name,
      zip_codes: neighborhood.zip_codes.join(','),
      delivery_fee: neighborhood.delivery_fee,
      active: neighborhood.active,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Bairros</h2>
        <button
          onClick={() => {
            setEditingNeighborhood(null);
            setFormData({ name: '', zip_codes: '', delivery_fee: 0, active: true });
            setShowForm(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          + Novo Bairro
        </button>
      </div>

      {error && <Toast message={error} type="error" />}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-4">{editingNeighborhood ? 'Editar Bairro' : 'Novo Bairro'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Bairro</label>
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
              <label className="block text-sm font-medium mb-1">CEPs (separados por vírgula)</label>
              <textarea
                name="zip_codes"
                value={formData.zip_codes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="01000-000, 02000-000, 03000-000"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Taxa de Entrega (R$)</label>
              <input
                type="number"
                name="delivery_fee"
                value={formData.delivery_fee}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="text-sm font-medium">Ativo</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
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
      )}

      {loading && neighborhoods.length === 0 ? (
        <p className="text-center py-8">Carregando bairros...</p>
      ) : neighborhoods.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum bairro cadastrado</p>
      ) : (
        <div className="grid gap-4">
          {neighborhoods.map((neighborhood) => (
            <div
              key={neighborhood.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{neighborhood.name}</h3>
                <p className="text-sm text-gray-600">Taxa: R$ {neighborhood.delivery_fee.toFixed(2)}</p>
                <p className="text-sm text-gray-600">CEPs: {neighborhood.zip_codes.join(', ')}</p>
                <span className="text-sm">{neighborhood.active ? '✅ Ativo' : '❌ Inativo'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(neighborhood)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(neighborhood.id)}
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
