import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import Toast from '../Toast';
import { getOrders, deleteOrder } from '../../services/orderService';
import type { Order } from '../../lib/types';

export function OrderManagement() {
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, [tenant?.id]);

  const loadOrders = async () => {
    if (!tenant?.id) return;
    try {
      setLoading(true);
      const data = await getOrders(tenant.id);
      setOrders(data);
    } catch (err) {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        'Isso apagará todos os pedidos desta loja permanentemente. Deseja continuar?'
      )
    ) {
      return;
    }

    try {
      setError(null);
      await Promise.all(orders.map((order) => deleteOrder(order.id)));
      setOrders([]);
    } catch (err) {
      setError('Erro ao deletar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este pedido?')) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setError('Erro ao deletar pedido');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
        {orders.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Deletar Tudo
          </button>
        )}
      </div>

      {error && <Toast message={error} type="error" />}

      {loading && orders.length === 0 ? (
        <p className="text-center py-8">Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum pedido cadastrado</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-600">Total: R$ {order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <p className="text-sm text-gray-600">
                  Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(order.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}