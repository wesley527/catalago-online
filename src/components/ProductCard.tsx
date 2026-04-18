import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Toast from './Toast';
import type { Product } from '../lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock) {
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_url,
      });
      setToastMessage(`${product.name} adicionado ao carrinho!`);
      setShowToast(true);
      setQuantity(1);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      {/* Imagem do Produto */}
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}
      {/* Informações do Produto */}
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">
          R$ {product.price.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500">
          {product.stock} em estoque
        </span>
      </div>

      {/* Seletor de Quantidade */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
            className="flex-1 text-center border border-gray-300 rounded py-1"
            min="1"
            max={product.stock}
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      )}

      {/* Botão Adicionar ao Carrinho */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-orange-600 text-white hover:bg-orange-700'
        }`}
      >
        {isOutOfStock ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
      </button>

      {showToast && <Toast message={toastMessage} type="success" />}
    </div>
  );
}
