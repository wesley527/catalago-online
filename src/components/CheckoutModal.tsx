import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import { generateWhatsAppLink, formatCurrency } from '../lib/utils';
import Toast from './Toast';
import { getNeighborhoods } from '../services/neighborhoodService';
import type { Neighborhood } from '../lib/types';

type DeliveryType = 'pickup' | 'delivery';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { tenant } = useTenant();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    paymentMethod: 'cash' as const,
  });
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tenant?.id) return;

    let cancelled = false;
    getNeighborhoods(tenant.id)
      .then((data) => {
        if (!cancelled) setNeighborhoods(data);
      })
      .catch(() => {
        if (!cancelled) setNeighborhoods([]);
      });

    return () => {
      cancelled = true;
    };
  }, [tenant?.id]);

  const subtotal = total;
  const selectedNeighborhood = useMemo(
    () => neighborhoods.find((n) => n.id === selectedNeighborhoodId) ?? null,
    [neighborhoods, selectedNeighborhoodId]
  );

  const deliveryFee =
    deliveryType === 'delivery' && selectedNeighborhood ? selectedNeighborhood.delivery_fee : 0;

  const grandTotal = subtotal + deliveryFee;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Nome é obrigatório';
    }
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Telefone é obrigatório';
    } else if (!/^[0-9\s\-\(\)]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Telefone inválido';
    }

    if (deliveryType === 'delivery') {
      if (neighborhoods.length === 0) {
        newErrors.delivery =
          'Não há bairros cadastrados. Use retirada ou cadastre bairros no painel administrativo.';
      } else if (!selectedNeighborhoodId) {
        newErrors.delivery = 'Selecione o bairro de entrega';
      }
      if (!formData.customer_address.trim()) {
        newErrors.customer_address = 'Endereço completo é obrigatório para entrega';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const addressForOrder =
      deliveryType === 'pickup'
        ? formData.customer_address.trim() || 'Retirada na loja'
        : formData.customer_address.trim();

    setLoading(true);
    try {
      setMessage('Pedido criado com sucesso!');
      clearCart();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const canChooseDelivery = neighborhoods.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Finalizar Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-2xl leading-none"
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">Resumo do Pedido:</h3>
            <div className="space-y-2 text-sm mb-3 max-h-32 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega:</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              )}
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-blue-600">
              <span>Total:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Delivery Type Selection */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Como receber</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === 'pickup'}
                  onChange={() => {
                    setDeliveryType('pickup');
                    setSelectedNeighborhoodId('');
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Retirada na loja (sem taxa de entrega)</span>
              </label>
              <label
                className={`flex items-center gap-2 ${canChooseDelivery ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === 'delivery'}
                  disabled={!canChooseDelivery}
                  onChange={() => setDeliveryType('delivery')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Entrega em bairro (taxa conforme cadastro)</span>
              </label>
            </div>
            {!canChooseDelivery && (
              <p className="text-xs text-amber-700 mt-2">
                Para habilitar entrega por bairro, cadastre bairros no painel administrativo.
              </p>
            )}
          </div>

          {/* Neighborhood Selection */}
          {deliveryType === 'delivery' && canChooseDelivery && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <select
                value={selectedNeighborhoodId}
                onChange={(e) => setSelectedNeighborhoodId(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.delivery ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o bairro</option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} — {formatCurrency(n.delivery_fee)}
                  </option>
                ))}
              </select>
              {errors.delivery && (
                <p className="text-red-600 text-sm mt-1">{errors.delivery}</p>
              )}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customer_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer_name && (
              <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customer_phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer_phone && (
              <p className="text-red-600 text-sm mt-1">{errors.customer_phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
            <input
              type="text"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customer_address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Rua, número, complemento, bairro"
            />
            {errors.customer_address && (
              <p className="text-red-600 text-sm mt-1">{errors.customer_address}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            >
              <option value="cash">Dinheiro</option>
              <option value="card">Cartão</option>
              <option value="pix">PIX</option>
            </select>
          </div>

          {message && (
            <Toast
              message={message}
              type={message.includes('sucesso') ? 'success' : 'error'}
            />
          )}

          {/* Buttons */}
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
              disabled={loading || items.length === 0}
            >
              {loading ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
