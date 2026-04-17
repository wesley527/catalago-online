import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import Toast from './Toast';

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { tenant } = useTenant();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cash' as const,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage('Pedido enviado com sucesso!');
      setTimeout(() => {
        clearCart();
        onClose();
      }, 2000);
    } catch (error) {
      setMessage('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Finalizar Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
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
                  <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-orange-600">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
