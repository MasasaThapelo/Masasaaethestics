'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { products as staticProducts, getUniquePhoneModels as getStaticModels, Product } from '@/data/products';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const PhoneCase3D = dynamic(() => import('@/components/PhoneCase3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-32 h-56 rounded-3xl bg-gradient-to-br from-gray-200/10 to-gray-300/10 animate-pulse" />
    </div>
  ),
});

export default function Home() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?live=true');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        // Fallback to static products on error
        console.error('Using static products fallback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const phoneModels = Array.from(new Set(products.map((p: any) => p.phoneModel)));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24 space-y-32">
        {/* 3D Phone Case Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Art in your pocket.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We believe your phone case should be an extension of your style.
              Each design is curated to bring elegance and personality to your daily device.
            </p>
          </div>
          <div className="w-full h-[700px] md:h-[600px] relative mt-12 md:mt-0 pointer-events-auto flex items-center justify-center">
            <PhoneCase3D />
          </div>
        </motion.section>

        {/* Phone Model Sections */}
        {phoneModels.map((phoneModel, sectionIndex) => {
          const modelProducts = products.filter((p: any) => p.phoneModel === phoneModel);
          return (
            <section key={phoneModel} className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-end justify-between border-b border-border pb-4"
              >
                <h2 className="text-3xl font-bold tracking-tight text-foreground">{phoneModel}</h2>
                <span className="text-sm text-muted-foreground">{modelProducts.length} Designs</span>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {modelProducts.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

