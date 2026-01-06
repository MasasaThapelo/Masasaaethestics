'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { useCart } from '@/components/CartContext';
import PaymentInstructions from '@/components/PaymentInstructions';
import SAShippingNotice from '@/components/SAShippingNotice';
import { CheckoutFormData, FormErrors } from '@/lib/types';
import { validateCheckoutForm, hasErrors } from '@/lib/validation';
import { config, requiresPaxi } from '@/lib/config';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart, isHydrated } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paxiCode: '',
    paxiFeeConfirmed: false,
  });

  const isSA = requiresPaxi(formData.country);
  const paxiFee = config.shipping.paxiFee;
  const totalPrice = getTotalPrice() + (isSA && formData.paxiFeeConfirmed ? paxiFee : 0);

  // Redirect to cart if empty (but not if order was just placed)
  useEffect(() => {
    if (isHydrated && cart.length === 0 && !isOrderPlaced) {
      router.push('/cart');
    }
  }, [isHydrated, cart.length, isOrderPlaced, router]);

  // Show loading state while cart is hydrating from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateCheckoutForm(formData);
    setFormErrors(errors);
    
    if (hasErrors(errors)) {
      return;
    }
    
    if (isSA && !formData.paxiFeeConfirmed) {
      alert(`Please confirm that you have added the R${paxiFee} PAXI fee for South African delivery.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: cart,
        total: totalPrice,
        subtotal: getTotalPrice(),
        paxiFee: isSA && formData.paxiFeeConfirmed ? paxiFee : 0,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create order: ${response.status} ${response.statusText}`);
      }

      const { orderId } = await response.json();
      setIsOrderPlaced(true);
      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +27 12 345 6789"
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select a country</option>
                    {config.shipping.supportedCountries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.country && <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent ${formErrors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.postalCode && <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <PaymentInstructions />

            {/* SA Shipping Notice */}
            <SAShippingNotice
              isSA={isSA}
              paxiCode={formData.paxiCode}
              onPaxiCodeChange={(code) => setFormData((prev) => ({ ...prev, paxiCode: code }))}
              paxiFeeConfirmed={formData.paxiFeeConfirmed}
              onPaxiFeeConfirmedChange={(confirmed) => setFormData((prev) => ({ ...prev, paxiFeeConfirmed: confirmed }))}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.customization}`} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-600">{item.product.phoneModel}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      {item.customization && (
                        <p className="text-xs text-gray-500 truncate">Custom: {item.customization}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">R{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>R{getTotalPrice()}</span>
                </div>
                {isSA && formData.paxiFeeConfirmed && (
                  <div className="flex justify-between text-gray-700">
                    <span>PAXI Fee</span>
                    <span>R40</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>R{totalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

