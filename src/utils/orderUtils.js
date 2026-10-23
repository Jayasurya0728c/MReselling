/**
 * Utility functions for COD Order Request formatting and WhatsApp integration
 */
import storeConfig from '../config/storeConfig';

/**
 * Formats a clean, readable WhatsApp COD order message as specified in business requirements.
 */
export function formatWhatsAppOrderMessage({
  reference,
  customerName,
  customerPhone,
  houseName,
  streetLocality,
  postOffice,
  district,
  state = 'Kerala',
  pincode,
  deliveryInstructions = '',
  items = [],
  subtotal,
  shippingFee,
  totalAmount
}) {
  const fullAddress = [
    houseName,
    streetLocality,
    postOffice,
    `${district}, ${state} - ${pincode}`,
    deliveryInstructions ? `(Note: ${deliveryInstructions})` : ''
  ].filter(Boolean).join(', ');

  const itemsFormatted = items.map(item => {
    const variantLine = item.variant ? `  Variant: ${item.variant}\n` : '';
    return `• ${item.name} × ${item.quantity}\n${variantLine}  Price: ₹${item.unitPrice || item.price} each (Total: ₹${item.totalPrice || (item.price * item.quantity)})`;
  }).join('\n\n');

  const message = 
`NEW COD ORDER REQUEST

Order reference: ${reference}

Customer: ${customerName}
Mobile: ${customerPhone}
Delivery address: ${fullAddress}

Items:
${itemsFormatted}

Subtotal: ₹${subtotal}
Shipping: ₹${shippingFee === 0 ? 'FREE' : shippingFee}
Total COD amount: ₹${totalAmount}

Please verify product availability and delivery details before confirming the order.`;

  return message;
}

/**
 * Builds the wa.me URL for the configured store WhatsApp number.
 */
export function buildWhatsAppOrderUrl(message, customWhatsAppNumber) {
  const phone = customWhatsAppNumber || storeConfig.whatsappNumber;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Formats INR currency
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}
