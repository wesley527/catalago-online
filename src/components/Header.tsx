import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onCartClick: () => void;
}

export const Header = ({ onCartClick }: HeaderProps) => {
  const { items } = useCart();
  const { tenant } = useTenant();
  const { logoUrl } = useTheme();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={tenant?.name || 'Logo'} className="h-10 w-auto object-contain" />
          ) : (
            <Store className="w-8 h-8 text-blue-600" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {tenant?.name || 'CatalogHub'}
          </h1>
        </div>

        <button
          onClick={onCartClick}
          className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
