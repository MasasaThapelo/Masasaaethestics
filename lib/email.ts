import { Resend } from 'resend';
import { Order } from './types';
import { config } from './config';

// Initialize Resend only when API key is available (lazy initialization)
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendOrderConfirmationEmail(order: Order) {
  const resend = getResendClient();
  
  if (!resend) {
    console.log('Email would be sent (RESEND_API_KEY not configured):');
    console.log(`To: ${order.email}, thembimasasa2@gmail.com`);
    console.log(`Subject: Order Confirmation #${order.orderId}`);
    return { success: true, note: 'Email logged (configure RESEND_API_KEY for production)' };
  }

  try {
    const { symbol } = config.currency;
    
    // Get base URL for images (will use deployment URL in production)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const itemsHtml = order.items.map((item) => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${baseUrl}${item.product.imageUrl}" alt="${item.product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
            <div>
              <strong>${item.product.name}</strong><br/>
              <span style="color: #666; font-size: 14px;">${item.product.phoneModel}</span>
            </div>
          </div>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; vertical-align: middle;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; vertical-align: middle;">${symbol}${item.product.price * item.quantity}</td>
      </tr>
      ${item.customization ? `<tr><td colspan="3" style="padding: 4px 8px; font-size: 12px; color: #666;">Customization: ${item.customization}</td></tr>` : ''}`
    ).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; }
            .total { font-size: 18px; font-weight: bold; margin-top: 10px; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${order.name},</p>
              <p>Thank you for your order! We've received your order and will process it once payment is confirmed.</p>
              
              <div class="order-details">
                <h2>Order #${order.orderId}</h2>
                <table>
                  <thead>
                    <tr style="background-color: #f5f5f5;">
                      <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                      <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                      <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ddd;">
                  <p>Subtotal: ${symbol}${order.subtotal}</p>
                  ${order.paxiFee > 0 ? `<p>PAXI Fee: ${symbol}${order.paxiFee}</p>` : ''}
                  <p class="total">Total: ${symbol}${order.total}</p>
                </div>
              </div>

              <div class="order-details">
                <h3>Shipping Address</h3>
                <p>
                  ${order.address}<br>
                  ${order.city}, ${order.postalCode}<br>
                  ${order.country}
                </p>
              </div>

              <div class="warning">
                <h3 style="margin-top: 0;">⚠️ IMPORTANT: Payment Instructions</h3>
                <p>Please send proof of payment to our WhatsApp number: <strong>${config.business.whatsappDisplay}</strong></p>
                <p>Your order will only be processed once proof of payment is received via WhatsApp.</p>
              </div>

              <p>We'll send you another confirmation once your payment is verified.</p>
              <p>Best regards,<br>Masasa Aesthetics</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send to customer (using business email for testing with free Resend tier)
    const customerEmail = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: 'thembimasasa2@gmail.com',
      subject: `Order Confirmation #${order.orderId} - Customer: ${order.email}`,
      html: htmlContent,
    });

    if (customerEmail.error) {
      console.error('Customer email error:', customerEmail.error);
    }

    // Send to business email
    const businessEmail = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: 'thembimasasa2@gmail.com',
      subject: `New Order Received #${order.orderId}`,
      html: htmlContent,
    });

    if (businessEmail.error) {
      console.error('Business email error:', businessEmail.error);
    }

    // Return success if at least one email was sent
    const success = !customerEmail.error || !businessEmail.error;
    return { 
      success, 
      data: { customer: customerEmail.data, business: businessEmail.data },
      errors: {
        customer: customerEmail.error,
        business: businessEmail.error
      }
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

