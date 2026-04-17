import React from 'react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const { items, removeItem, updateQuantity, total } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Carrinho</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Carrinho vazio</p>
      ) : (
        <>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    R$ {item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="ml-2 text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-lg font-semibold text-orange-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
          >
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
}
