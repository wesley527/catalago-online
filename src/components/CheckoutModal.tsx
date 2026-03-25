import { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import { generateWhatsAppLink, formatCurrency } from '../lib/utils';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { CheckoutData } from '../lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal = ({ isOpen, onClose, onSuccess }: CheckoutModalProps) => {
  const { items, getTotal, clearCart } = useCart();
  const { tenant } = useTenant();
  const [formData, setFormData] = useState<CheckoutData>({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

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
    if (!formData.customer_address.trim()) {
      newErrors.customer_address = 'Endereço é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!tenant?.id) {
      setErrors({ submit: 'Loja não identificada' });
      return;
    }

    setLoading(true);
    try {
      const total = getTotal();

      // Create order
      const order = await orderService.createOrder(
        formData.customer_name,
        formData.customer_phone,
        formData.customer_address,
        total,
        tenant.id
      );

      // Create order items
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      await orderService.createOrderItems(order.id, orderItems);

      // Update stock
      for (const item of items) {
        const newStock = item.product.stock_quantity - item.quantity;
        await productService.updateStock(item.product.id, newStock);
      }

      // Generate WhatsApp link
      const whatsappItems = items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const whatsappLink = generateWhatsAppLink(
        formData.customer_phone,
        formData.customer_name,
        whatsappItems,
        total,
        formData.customer_address
      );

      // Clear cart
      clearCart();

      // Close modal and show success
      onSuccess();
      onClose();

      // Redirect to WhatsApp
      setTimeout(() => {
        window.open(whatsappLink, '_blank');
      }, 500);
    } catch (error) {
      console.error('Error processing order:', error);
      setErrors({ submit: 'Erro ao processar pedido. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const total = getTotal();

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Finalizar Compra</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
              <div className="space-y-2 mb-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-blue-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_name && (
                <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                placeholder="(00) 99999-9999"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_phone && (
                <p className="text-red-600 text-sm mt-1">{errors.customer_phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <textarea
                value={formData.customer_address}
                onChange={(e) =>
                  setFormData({ ...formData, customer_address: e.target.value })
                }
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_address && (
                <p className="text-red-600 text-sm mt-1">{errors.customer_address}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
