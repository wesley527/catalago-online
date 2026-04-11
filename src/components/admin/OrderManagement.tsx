import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, Trash2 } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../lib/utils';

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
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (tenant?.id) {
      loadOrders();
    }
  }, [tenant?.id]);

  const loadOrders = async () => {
    if (!tenant?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrdersWithItems(tenant.id);
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar pedidos';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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

    try {
      await orderService.updateOrderStatus(orderId, newStatus, tenant.id);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(message);
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'pending') return 'Pendente';
    if (status === 'confirmed') return 'Confirmado';
    if (status === 'delivered') return 'Entregue';
    return status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
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

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg">Nenhum pedido realizado ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <button
                onClick={() =>
                  setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-semibold text-gray-900">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.customer_name} • {formatPhone(order.customer_phone)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedOrderId === order.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expandedOrderId === order.id && (
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
                    </div>
                  </div>

                  {/* Produtos */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Produtos</h4>
                    <div className="space-y-2">
                      {order.items?.length > 0 ? (
                        order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm bg-white p-2 rounded">
                            <span>
                              {item.products?.name || 'Produto'} x{item.quantity}
                            </span>
                            <span>
                              {formatCurrency(item.unit_price * item.quantity)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">Sem itens</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Status</h4>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="delivered">Entregue</option>
                    </select>

                    {order.status !== 'pending' && (
                      <div className="flex gap-3 mt-3">
                        <a
                          href={`https://wa.me/55${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Olá ${order.customer_name}, seu pedido foi atualizado para: ${getStatusText(order.status)}.\n\nObrigado pela preferência!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Enviar status no WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};