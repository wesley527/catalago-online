import React from 'react';
import { useCart } from '../contexts';

export function Cart() {
  const { items, total, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return <p className="text-gray-500">Carrinho vazio</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border rounded p-2">
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              +
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <div className="border-t pt-2 mt-2 font-bold">
        Total: R$ {total.toFixed(2)}
      </div>
    </div>
  );
}
