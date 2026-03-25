'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { products, ProductCategory, getProductsByCategory } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const categories: ProductCategory[] = ['Botanical Blossom', 'White Heaven', 'Strawberry Shortcake'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  const displayedProducts = selectedCategory === 'All'
    ? products
    : getProductsByCategory(selectedCategory);

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

        <div className="container mx-auto px-4 py-12 space-y-12">
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

          {/* Products Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {displayedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {displayedProducts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
