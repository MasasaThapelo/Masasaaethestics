'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { useCart } from '@/components/CartContext';
import { config } from '@/lib/config';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart, isHydrated } = useCart();

  // Show loading state while cart is hydrating
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.customization}`} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{item.product.phoneModel}</p>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 sm:hidden">
                        {config.currency.symbol}{item.product.price * item.quantity}
                      </p>
                    </div>
                    {item.customization && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Customization:</span> {item.customization}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.customization)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.customization)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 hidden sm:block">
                          {config.currency.symbol}{item.product.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId, item.customization)}
                          className="text-sm text-red-600 hover:text-red-800 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{config.currency.symbol}{getTotalPrice()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{config.currency.symbol}{getTotalPrice()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gold text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gold-700 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

