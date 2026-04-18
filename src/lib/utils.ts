// Formatting utilities
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(
    typeof date === 'string' ? new Date(date) : date
  );
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatZipCode = (zipCode: string): string => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const isValidZipCode = (zipCode: string): boolean => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.length === 8;
};

// Storage utilities
export const setStorageItem = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return defaultValue || null;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

// Format phone for WhatsApp
export const formatPhoneForWhatsApp = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    cleaned = cleaned.substring(2);
  }
  return `55${cleaned}`;
};

// Generate WhatsApp link
export function generateWhatsAppLink(
  phone: string,
  name: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  address: string,
  options?: { deliveryInfo?: string; subtotal?: number }
): string {
  const itemsList = items
    .map(
      (item) =>
        `• ${item.name} x${item.quantity} - ${formatCurrency(
          item.price * item.quantity
        )}`
    )
    .join('\n');

  let message = `Olá! Gostaria de confirmar meu pedido:\n\n`;
  message += `👤 Cliente: ${name}\n`;
  message += `📍 Endereço: ${address}\n`;

  if (options?.deliveryInfo) {
    message += `${options.deliveryInfo}\n`;
  }

  message += `\n🛒 Itens:\n${itemsList}\n\n`;

  if (options?.subtotal !== undefined) {
    message += `Subtotal: ${formatCurrency(options.subtotal)}\n`;
  }

  message += `💰 Total: ${formatCurrency(total)}`;

  const encodedMessage = encodeURIComponent(message);
  const formattedPhone = formatPhoneForWhatsApp(phone);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}