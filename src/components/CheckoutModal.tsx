<<<<<<< HEAD
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import Toast from './Toast';
=======
import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import { generateWhatsAppLink, formatCurrency } from '../lib/utils';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { neighborhoodService } from '../services/neighborhoodService';
import { CheckoutData, DeliveryType, Neighborhood } from '../lib/types';
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

<<<<<<< HEAD
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
=======
  useEffect(() => {
    if (!isOpen || !tenant?.id) return;

    setFormData({ customer_name: '', customer_phone: '', customer_address: '' });
    setDeliveryType('pickup');
    setSelectedNeighborhoodId('');
    setErrors({});

    let cancelled = false;
    neighborhoodService
      .getAllByTenant(tenant.id)
      .then((data) => {
        if (!cancelled) setNeighborhoods(data);
      })
      .catch(() => {
        if (!cancelled) setNeighborhoods([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, tenant?.id]);

  const subtotal = getTotal();

  const selectedNeighborhood = useMemo(
    () => neighborhoods.find((n) => n.id === selectedNeighborhoodId) ?? null,
    [neighborhoods, selectedNeighborhoodId]
  );

  const deliveryFee =
    deliveryType === 'delivery' && selectedNeighborhood ? selectedNeighborhood.price : 0;

  const grandTotal = subtotal + deliveryFee;

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
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    setLoading(true);
    setMessage('');

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage('Pedido enviado com sucesso!');
=======

    if (!validateForm()) return;

    if (!tenant?.id) {
      setErrors({ submit: 'Loja não identificada' });
      return;
    }

    const addressForOrder =
      deliveryType === 'pickup'
        ? formData.customer_address.trim() || 'Retirada na loja'
        : formData.customer_address.trim();

    const neighborhoodId =
      deliveryType === 'delivery' && selectedNeighborhood ? selectedNeighborhood.id : null;
    const neighborhoodName =
      deliveryType === 'delivery' && selectedNeighborhood ? selectedNeighborhood.name : null;

    setLoading(true);
    try {
      const order = await orderService.createOrder({
        customerName: formData.customer_name,
        customerPhone: formData.customer_phone,
        customerAddress: addressForOrder,
        totalAmount: grandTotal,
        tenantId: tenant.id,
        deliveryType,
        deliveryFee,
        neighborhoodId,
        neighborhoodName,
      });

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      await orderService.createOrderItems(order.id, orderItems);

      for (const item of items) {
        const newStock = item.product.stock_quantity - item.quantity;
        await productService.updateStock(item.product.id, newStock);
      }

      const whatsappItems = items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      let deliveryInfo = '';
      if (deliveryType === 'pickup') {
        deliveryInfo = '*Tipo:* Retirada na loja';
      } else if (selectedNeighborhood) {
        deliveryInfo = `*Tipo:* Entrega — *Bairro:* ${selectedNeighborhood.name} — *Taxa:* ${formatCurrency(deliveryFee)}`;
      }

      const whatsappLink = generateWhatsAppLink(
        formData.customer_phone,
        formData.customer_name,
        whatsappItems,
        grandTotal,
        addressForOrder,
        {
          deliveryInfo,
          subtotal: deliveryFee > 0 ? subtotal : undefined,
        }
      );

      clearCart();

      onSuccess();
      onClose();

>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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

<<<<<<< HEAD
=======
  const canChooseDelivery = neighborhoods.length > 0;

>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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

<<<<<<< HEAD
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
=======
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                      {n.name} — {formatCurrency(n.price)}
                    </option>
                  ))}
                </select>
                {errors.delivery && (
                  <p className="text-red-600 text-sm mt-1">{errors.delivery}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
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
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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

<<<<<<< HEAD
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
=======
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {deliveryType === 'pickup'
                  ? 'Observações (opcional)'
                  : 'Endereço completo para entrega'}
              </label>
              <textarea
                value={formData.customer_address}
                onChange={(e) =>
                  setFormData({ ...formData, customer_address: e.target.value })
                }
                rows={3}
                placeholder={
                  deliveryType === 'pickup'
                    ? 'Ex.: horário preferido para retirada'
                    : 'Rua, número, complemento, ponto de referência...'
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_address && (
                <p className="text-red-600 text-sm mt-1">{errors.customer_address}</p>
              )}
            </div>
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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
