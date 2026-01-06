'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { getProductById } from '@/data/products';
import { useCart } from '@/components/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const product = getProductById(params.id as string);
  const [customization, setCustomization] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      productId: product.id,
      product: product,
      customization: customization.trim(),
      quantity: 1,
    });
    // Small delay to show feedback, then redirect
    setTimeout(() => {
      setIsAdding(false);
      router.push('/cart');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative w-full h-96 md:h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-xl text-gray-600 mt-2">{product.phoneModel}</p>
            </div>

            <div className="text-3xl font-bold text-gray-900">
              R{product.price}
            </div>

            {product.description && (
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            )}

            {/* Customization Field */}
            <div>
              <label htmlFor="customization" className="block text-sm font-medium text-gray-700 mb-2">
                Add your initials or custom request (optional):
              </label>
              <textarea
                id="customization"
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
                placeholder="Enter your initials or any special requests..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-gold text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

