import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatOrderMessage, formatBusinessNotification } from '@/lib/whatsapp';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { Order, CreateOrderRequest } from '@/lib/types';
import { config } from '@/lib/config';
import { supabase } from '@/lib/supabase';

// Health check endpoint
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomPart}`;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.name || !orderData.email || !orderData.phone || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create order object
    const order = {
      orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store order in Supabase
    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .insert([order]);

      if (error) {
        console.error('Supabase error inserting order:', error);
        // We still continue as the in-memory storage fallback is gone, 
        // but we'll return an error if the database write fails in production.
        // For now, let's treat it as a hard failure for data integrity.
        throw new Error('Failed to save order to database');
      }
    }

    // Send confirmations (don't fail the order if these fail)
    try {
      // Send WhatsApp confirmation to customer
      const customerMessage = formatOrderMessage(order);
      await sendWhatsAppMessage(orderData.phone, customerMessage);
    } catch (whatsappError) {
      console.error('WhatsApp error (non-fatal):', whatsappError);
    }

    try {
      // Send WhatsApp notification to business
      const businessNumber = config.business.whatsappNumber;
      const businessMessage = formatBusinessNotification(order);
      await sendWhatsAppMessage(businessNumber, businessMessage);
    } catch (whatsappError) {
      console.error('Business WhatsApp error (non-fatal):', whatsappError);
    }

    try {
      // Send email confirmation
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error('Email error (non-fatal):', emailError);
    }

    return NextResponse.json(
      { orderId, success: true },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { error: errorMessage },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Get order by ID (for order confirmation page)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    );
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('orderId', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(order, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

