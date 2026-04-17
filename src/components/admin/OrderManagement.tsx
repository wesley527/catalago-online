<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, Trash2 } from 'lucide-react';
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
import { useTenant } from '../../contexts/TenantContext';
import Toast from '../Toast';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import type { Order } from '../../lib/types';

<<<<<<< HEAD
export default function OrderManagement() {
=======
interface OrderWithItems {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivery_type?: string;
  delivery_fee?: number;
  neighborhood_name?: string | null;
  items: any[];
}

export const OrderManagement = () => {
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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

<<<<<<< HEAD
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
=======
  const handleClearAllOrders = async () => {
    if (!tenant?.id) return;
    if (
      !window.confirm(
        'Isso apagará todos os pedidos desta loja permanentemente. Deseja continuar?'
      )
    ) {
      return;
    }

    try {
      setError(null);
      await orderService.deleteAllOrdersForTenant(tenant.id);
      setOrders([]);
      setExpandedOrderId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao zerar pedidos';
      setError(message);
    }
  };

  const deliveryLabel = (order: OrderWithItems) => {
    if (order.delivery_type === 'pickup') {
      return 'Retirada na loja';
    }
    const fee = order.delivery_fee ?? 0;
    const name = order.neighborhood_name || '—';
    return `Entrega — ${name}${fee > 0 ? ` (${formatCurrency(fee)})` : ''}`;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!tenant?.id) return;

>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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
<<<<<<< HEAD
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h2>
=======
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
        {!loading && orders.length > 0 && (
          <button
            type="button"
            onClick={handleClearAllOrders}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Zerar todos os pedidos
          </button>
        )}
      </div>
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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
<<<<<<< HEAD
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
=======
                <div className="border-t px-6 py-4 bg-gray-50 space-y-4">
                  
                  {/* Cliente */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Informações do Cliente
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><strong>Nome:</strong> {order.customer_name}</p>
                      <p>
                        <strong>WhatsApp:</strong>{' '}
                        <a
                          href={`https://wa.me/55${order.customer_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {formatPhone(order.customer_phone)}
                        </a>
                      </p>
                      <p><strong>Endereço / observações:</strong> {order.customer_address}</p>
                      <p><strong>Entrega:</strong> {deliveryLabel(order)}</p>
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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