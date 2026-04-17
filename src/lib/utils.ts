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

// ✅ FORMATAR NÚMERO PARA WHATSAPP
export const formatPhoneForWhatsApp = (phone: string): string => {
  console.log('[formatPhoneForWhatsApp] Entrada:', phone);
  
  // Remove todos os caracteres que não são números
  let cleaned = phone.replace(/\D/g, '');
  console.log('[formatPhoneForWhatsApp] Após remover caracteres:', cleaned);
  
  // Remove o 55 se existir no início (para evitar duplicação)
  if (cleaned.startsWith('55')) {
    cleaned = cleaned.substring(2);
    console.log('[formatPhoneForWhatsApp] Removido 55 duplicado:', cleaned);
  }
  
  // Adiciona o 55 (código do Brasil) no início
  cleaned = `55${cleaned}`;
  console.log('[formatPhoneForWhatsApp] Saída final com 55:', cleaned);
  
  return cleaned;
};

export function generateWhatsAppLink(
  phone: string,
  name: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  address: string,
  deliveryInfo: string,
  observation?: string
): string {
  console.log('[generateWhatsAppLink] Telefone recebido:', phone);
  
  const itemsList = items
    .map((item) => `${item.name} x${item.quantity} - R$ ${item.price.toFixed(2)}`)
    .join('%0A');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const observationLine = observation?.trim()
    ? `%0A%0A📝 Observações:%0A${encodeURIComponent(observation.trim())}`
    : '';

  const message = `Olá! Gostaria de confirmar meu pedido:%0A%0A*ITENS:*%0A${itemsList}%0A%0A*SUBTOTAL:* R$ ${subtotal.toFixed(2)}%0A*${deliveryInfo}*%0A*TOTAL:* R$ ${total.toFixed(2)}%0A%0A*DADOS:*%0A📍 ${address}%0A👤 ${name}${observationLine}`;

  // ✅ Formata o telefone adicionando 55 se necessário
  const formattedPhone = formatPhoneForWhatsApp(phone);
  
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${message}`;
  
  console.log('[generateWhatsAppLink] Link final:', whatsappLink);
  
  return whatsappLink;
}
