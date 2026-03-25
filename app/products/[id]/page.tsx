'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { getProductById as getStaticProduct, Product } from '@/data/products';
import { useCart } from '@/components/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [customization, setCustomization] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((p: any) => p.id === params.id);
          if (found) {
            setProduct(found);
            return;
          }
        }
      } catch (error) {
        console.error('API fetch failed, using static fallback');
      }
      // Fallback to static
      setProduct(getStaticProduct(params.id as string) || null);
    };
    fetchProduct();
  }, [params.id]);

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button variant="outline" onClick={() => router.push('/products')}>
            Back to Collection
          </Button>
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

    // Simulate loading/feedback
    setTimeout(() => {
      setIsAdding(false);
      // Open cart drawer or redirect
      router.push('/cart');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-32">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-8 text-muted-foreground hover:text-foreground flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Floating/Sticky Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative lg:sticky lg:top-32 h-[50vh] lg:h-[70vh] w-full rounded-2xl overflow-hidden bg-secondary/30"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4 border-b border-border pb-8"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{product.name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-xl text-muted-foreground">{product.phoneModel}</p>
                <p className="text-3xl font-bold text-foreground">R{product.price}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description || "Experience the perfect blend of style and protection with this premium case. Designed to be durable yet lightweight, it ensures your device looks stunning from every angle."}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pb-6">
                {['Durable', 'Lightweight', 'Premium Finish', 'Anti-Scratch'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Customization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4 bg-secondary/30 p-6 rounded-xl"
            >
              <label htmlFor="customization" className="block text-sm font-medium text-foreground">
                Personalization (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="customization"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  placeholder="Add initials, names, or special requests..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  rows={3}
                />
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-4 pt-4"
            >
              <Button
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAdding}
                className="w-full text-lg h-14 rounded-full"
              >
                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>

              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
