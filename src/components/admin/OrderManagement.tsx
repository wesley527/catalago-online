import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import Toast from '../Toast';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import type { Order } from '../../lib/types';

export default function OrderManagement() {
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError('Erro ao atualizar status do pedido');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  if (loading && orders.length === 0) {
    return <p className="text-center py-8">Carregando pedidos...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h2>

      {error && <Toast message={error} type="error" />}

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum pedido encontrado</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                className="p-4 bg-gray-50 cursor-pointer flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{order.customer_name}</h3>
                  <p className="text-sm text-gray-600">{order.customer_email}</p>
                  <p className="text-sm text-gray-600">{order.customer_phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-orange-600">
                    R$ {order.total.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                  <span className="text-gray-500">
                    {expandedOrderId === order.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="p-4 border-t">
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Itens do Pedido:</h4>
                    <div className="space-y-2 text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span className="font-semibold">R$ {item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm"><strong>Endereço:</strong> {order.address}</p>
                    <p className="text-sm"><strong>Pagamento:</strong> {order.payment_method}</p>
                    <p className="text-sm"><strong>Data:</strong> {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="preparing">Preparando</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}