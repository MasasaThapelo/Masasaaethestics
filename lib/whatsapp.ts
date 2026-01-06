import { Order } from './types';
import { config } from './config';

export async function sendWhatsAppMessage(to: string, message: string) {
  // Using WhatsApp Business API or Twilio
  // For now, we'll use a simple implementation that can be replaced with actual API
  
  const whatsappNumber = process.env.WHATSAPP_NUMBER || config.business.whatsappNumber;
  const apiKey = process.env.WHATSAPP_API_KEY;
  
  // If using Twilio
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      // Dynamic import to avoid build-time issues
      const twilioModule = await import('twilio');
      const twilio = 'default' in twilioModule ? twilioModule.default : twilioModule;
      
      if (typeof twilio !== 'function') {
        throw new Error('Twilio module is not a function');
      }
      
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      // Format phone number (ensure it starts with country code)
      const formattedTo = to.startsWith('+') ? to : `+${to}`;
      const formattedFrom = whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`;
      
      await client.messages.create({
        from: `whatsapp:${formattedFrom}`,
        to: `whatsapp:${formattedTo}`,
        body: message,
      });
      return { success: true };
    } catch (error) {
      console.error('Twilio WhatsApp error:', error);
      // Don't throw - just log and continue
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  // Fallback: Log the message (for development)
  // In production, you would integrate with WhatsApp Business API
  console.log('WhatsApp Message (would be sent):');
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  
  return { success: true, note: 'Message logged (configure WhatsApp API for production)' };
}

export function formatOrderMessage(order: Order): string {
  const { symbol } = config.currency;
  const itemsText = order.items.map((item) => 
    `- ${item.product.name} (${item.product.phoneModel}) x${item.quantity} - ${symbol}${item.product.price * item.quantity}${item.customization ? `\n  Customization: ${item.customization}` : ''}`
  ).join('\n');
  
  return `Order Confirmation #${order.orderId}

Thank you for your order, ${order.name}!

Order Details:
${itemsText}

Subtotal: ${symbol}${order.subtotal}
${order.paxiFee > 0 ? `PAXI Fee: ${symbol}${order.paxiFee}\n` : ''}Total: ${symbol}${order.total}

Shipping Address:
${order.address}
${order.city}, ${order.postalCode}
${order.country}

IMPORTANT: Please send proof of payment to WhatsApp: ${config.business.whatsappDisplay}
Your order will be processed once payment is confirmed.

Order ID: ${order.orderId}`;
}

export function formatBusinessNotification(order: Order): string {
  const { symbol } = config.currency;
  const itemsText = order.items.map((item) => 
    `- ${item.product.name} (${item.product.phoneModel}) x${item.quantity} - ${symbol}${item.product.price * item.quantity}${item.customization ? `\n  Customization: ${item.customization}` : ''}`
  ).join('\n');
  
  return `New Order Received #${order.orderId}

Customer: ${order.name}
Email: ${order.email}
Phone: ${order.phone}

Order Details:
${itemsText}

Subtotal: ${symbol}${order.subtotal}
${order.paxiFee > 0 ? `PAXI Fee: ${symbol}${order.paxiFee}\n  PAXI Code: ${order.paxiCode || 'Not provided'}\n` : ''}Total: ${symbol}${order.total}

Shipping Address:
${order.address}
${order.city}, ${order.postalCode}
${order.country}

Order ID: ${order.orderId}`;
}

