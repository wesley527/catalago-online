import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, AlertCircle } from 'lucide-react';
import { Neighborhood } from '../../lib/types';
import { neighborhoodService } from '../../services/neighborhoodService';
import { useTenant } from '../../contexts/TenantContext';
import { formatCurrency } from '../../lib/utils';

export const NeighborhoodManagement = () => {
  const { tenant } = useTenant();
  const [list, setList] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Neighborhood | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');

  useEffect(() => {
    if (tenant?.id) {
      loadList();
    }
  }, [tenant?.id]);

  const loadList = async () => {
    if (!tenant?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await neighborhoodService.getAllByTenant(tenant.id);
      setList(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar bairros';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (): number | null => {
    const n = parseFloat(formPrice.replace(',', '.'));
    if (Number.isNaN(n) || n < 0) return null;
    return n;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?.id || !formName.trim()) return;

    const price = parsePrice();
    if (price === null) {
      setError('Informe um preço válido (taxa de entrega).');
      return;
    }

    try {
      if (editing) {
        await neighborhoodService.updateNeighborhood(editing.id, formName, price);
      } else {
        await neighborhoodService.createNeighborhood(formName, price, tenant.id);
      }
      setShowForm(false);
      setEditing(null);
      setFormName('');
      setFormPrice('');
      loadList();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar bairro';
      setError(message);
    }
  };

  const handleEdit = (n: Neighborhood) => {
    setEditing(n);
    setFormName(n.name);
    setFormPrice(String(n.price));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este bairro? Pedidos antigos podem perder a referência.')) return;

    try {
      await neighborhoodService.deleteNeighborhood(id);
      loadList();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir bairro';
      setError(message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormName('');
    setFormPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bairros e taxa de entrega</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Cadastre cada bairro com o valor da entrega. No checkout, o cliente escolhe bairro ou retirada.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo bairro
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-700 hover:text-red-900 text-sm">
            Fechar
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editing ? 'Editar bairro' : 'Novo bairro'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do bairro</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de entrega (R$)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ex: 5,00"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {editing ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando bairros...</p>
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center px-4">
            <p className="text-gray-600 text-lg mb-4">Nenhum bairro cadastrado</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Cadastrar primeiro bairro
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bairro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Taxa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{n.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{formatCurrency(n.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(n)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
