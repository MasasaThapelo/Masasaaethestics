'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import PaymentInstructions from '@/components/PaymentInstructions';

interface OrderItem {
  productId: string;
  product: {
    id: string;
    name: string;
    phoneModel: string;
    price: number;
    imageUrl: string;
  };
  customization: string;
  quantity: number;
}

interface Order {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  paxiFee: number;
  total: number;
  createdAt: string;
  status: string;
  paxiCode?: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateWhatsAppMessage = (order: Order): string => {
    const itemsText = order.items.map((item) => 
      `- ${item.product.name} (${item.product.phoneModel}) x${item.quantity} - R${item.product.price * item.quantity}${item.customization ? `\n  Customization: ${item.customization}` : ''}`
    ).join('\n');

    return `🛍️ NEW ORDER #${order.orderId}

👤 Customer: ${order.name}
📧 Email: ${order.email}
📱 Phone: ${order.phone}

📦 ORDER DETAILS:
${itemsText}

💰 Subtotal: R${order.subtotal}${order.paxiFee > 0 ? `\n💰 PAXI Fee: R${order.paxiFee}${order.paxiCode ? `\n📍 PAXI Code: ${order.paxiCode}` : ''}` : ''}
💰 TOTAL: R${order.total}

📍 SHIPPING ADDRESS:
${order.address}
${order.city}, ${order.postalCode}
${order.country}

Order ID: ${order.orderId}`;
  };

  const handleWhatsAppNotify = () => {
    if (!order) return;
    const message = generateWhatsAppMessage(order);
    const whatsappUrl = `https://wa.me/26663149604?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${params.orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (params.orderId) {
      fetchOrder();
    }
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
                <p className="text-green-700">
                  Thank you for your order, {order.name}! We've received your order and will process it once payment is confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{order.orderId}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-gray-900 capitalize">{order.status}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-600">{item.product.phoneModel}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    {item.customization && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Customization:</span> {item.customization}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">R{item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal</span>
                <span>R{order.subtotal}</span>
              </div>
              {order.paxiFee > 0 && (
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>PAXI Fee</span>
                  <span>R{order.paxiFee}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>R{order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <p className="text-gray-700">
              {order.address}<br />
              {order.city}, {order.postalCode}<br />
              {order.country}
            </p>
          </div>

          {/* Payment Instructions */}
          <PaymentInstructions />

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Email:</span> {order.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> {order.phone}
            </p>
          </div>

          {/* WhatsApp Notification */}
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-green-800 mb-2">📱 Notify Business via WhatsApp</h3>
                <p className="text-green-700 mb-4">
                  Click the button below to send your order details directly to our WhatsApp. This helps us process your order faster!
                </p>
                <button
                  onClick={handleWhatsAppNotify}
                  className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Send Order to Business
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/products')}
              className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-700 transition-colors"
            >
              Print Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

