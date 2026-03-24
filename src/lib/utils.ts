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
  address: string
): string => {
  const cleanPhone = phone.replace(/\D/g, '');

  let message = `Olá! Confirmo meu pedido:\n\n`;
  message += `*Cliente:* ${customerName}\n`;
  message += `*Endereço:* ${address}\n\n`;
  message += `*Produtos:*\n`;

  items.forEach((item) => {
    message += `• ${item.name} - ${item.quantity}x ${formatCurrency(item.price)}\n`;
  });

  message += `\n*Total:* ${formatCurrency(total)}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
};
