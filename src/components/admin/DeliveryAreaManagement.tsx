import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import Toast from '../Toast';
import { getDeliveryAreas, deleteDeliveryArea } from '../../services/deliveryAreaService';
import type { DeliveryArea } from '../../lib/types';

export default function DeliveryAreaManagement() {
  const { tenant } = useTenant();
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<DeliveryArea | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    zip_codes: '',
    delivery_fee: 0,
    active: true,
  });

  useEffect(() => {
    loadAreas();
  }, [tenant?.id]);

  const loadAreas = async () => {
    if (!tenant?.id) return;
    try {
      setLoading(true);
      const data = await getDeliveryAreas(tenant.id);
      setAreas(data);
    } catch (err) {
      setError('Erro ao carregar áreas de entrega');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'delivery_fee') {
      newValue = parseFloat(value) || 0;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFormData({ name: '', zip_codes: '', delivery_fee: 0, active: true });
      setEditingArea(null);
      setShowForm(false);
      loadAreas();
    } catch (err) {
      setError('Erro ao salvar área de entrega');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta área?')) return;
    try {
      await deleteDeliveryArea(id);
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError('Erro ao deletar área de entrega');
    }
  };

  const handleEdit = (area: DeliveryArea) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      zip_codes: area.zip_codes.join(','),
      delivery_fee: area.delivery_fee,
      active: area.active,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Áreas de Entrega</h2>
        <button
          onClick={() => {
            setEditingArea(null);
            setFormData({ name: '', zip_codes: '', delivery_fee: 0, active: true });
            setShowForm(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          + Nova Área
        </button>
      </div>

      {error && <Toast message={error} type="error" />}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-4">{editingArea ? 'Editar Área' : 'Nova Área'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Área</label>
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

      {loading && areas.length === 0 ? (
        <p className="text-center py-8">Carregando áreas...</p>
      ) : areas.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhuma área de entrega cadastrada</p>
      ) : (
        <div className="grid gap-4">
          {areas.map((area) => (
            <div
              key={area.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{area.name}</h3>
                <p className="text-sm text-gray-600">Taxa: R$ {area.delivery_fee.toFixed(2)}</p>
                <p className="text-sm text-gray-600">CEPs: {area.zip_codes.join(', ')}</p>
                <span className="text-sm">{area.active ? '✅ Ativo' : '❌ Inativo'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(area)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(area.id)}
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

