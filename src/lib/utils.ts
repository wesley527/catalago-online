export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned;
};

export const generateWhatsAppLink = (
  phone: string,
  customerName: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  address: string,
  options?: { deliveryInfo?: string; subtotal?: number }
): string => {
  const cleanPhone = phone.replace(/\D/g, '');

  let message = `Olá! Confirmo meu pedido:\n\n`;
  message += `*Cliente:* ${customerName}\n`;
  message += `*Endereço / entrega:* ${address}\n`;
  if (options?.deliveryInfo) {
    message += `${options.deliveryInfo}\n`;
  }
  message += `\n*Produtos:*\n`;

  items.forEach((item) => {
    message += `• ${item.name} - ${item.quantity}x ${formatCurrency(item.price)}\n`;
  });

  if (options?.subtotal !== undefined && options.subtotal !== total) {
    message += `\n*Subtotal produtos:* ${formatCurrency(options.subtotal)}`;
  }

  message += `\n*Total:* ${formatCurrency(total)}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
};
