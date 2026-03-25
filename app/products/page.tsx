'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { products as staticProducts, ProductCategory, Product } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

const staticCategories: ProductCategory[] = ['Botanical Blossom', 'White Heaven', 'Strawberry Shortcake'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, newArrivalRes] = await Promise.all([
          fetch('/api/products?live=true'),
          fetch('/api/products?newArrival=true')
        ]);

        const liveData = await liveRes.json();
        const newArrivalData = await newArrivalRes.json();

        if (Array.isArray(liveData)) setLiveProducts(liveData);
        if (Array.isArray(newArrivalData)) setNewArrivalProducts(newArrivalData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = staticCategories;

  const displayedStaticProducts = selectedCategory === 'All'
    ? staticProducts
    : staticProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Faint Background Logo */}
      <div
        className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.1] select-none"
        aria-hidden="true"
      >
        <img
          src="/images/Masasa-logo.png"
          alt=""
          className="w-[80%] max-w-2xl object-contain"
        />
      </div>

      <div className="relative z-10">
        <Header />

        {/* Page Header */}
        <div className="bg-secondary/30 pt-32 pb-12 md:pb-24">
          <div className="container mx-auto px-4 text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-xl mx-auto text-lg"
            >
              Explore our curated selection of premium cases, designed to protect and impress.
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "rounded-full px-6",
                selectedCategory === 'All' ? "" : "bg-transparent border-gray-300 hover:bg-gray-100"
              )}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full px-6",
                  selectedCategory === category ? "" : "bg-transparent border-gray-300 hover:bg-gray-100"
                )}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Latest Uploads Section */}
          {liveProducts.length > 0 && selectedCategory === 'All' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Latest Releases</h2>
                <span className="text-sm text-muted-foreground">{liveProducts.length} New Designs</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {liveProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* New Arrivals Section */}
          {newArrivalProducts.length > 0 && selectedCategory === 'All' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">New Arrivals</h2>
                  <span className="hidden md:flex bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{newArrivalProducts.length} Upcoming Designs</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {newArrivalProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Main Collection Grid */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {selectedCategory === 'All' ? 'Our Collection' : selectedCategory}
              </h2>
              <span className="text-sm text-muted-foreground">{displayedStaticProducts.length} Designs</span>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {displayedStaticProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {displayedStaticProducts.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No products found in this category.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
