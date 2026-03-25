'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 supports-[backdrop-filter]:bg-background/60"
      >
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop Logo (Left Side) */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="relative w-12 h-12 transition-transform hover:scale-105">
              <Image
                src="/images/Masasa-logo.png"
                alt="Masasa Aesthetics"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Center Brand Name (Hidden on Mobile, Centered on Desktop) */}
          <Link
            href="/"
            className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-2 group"
          >
            <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Masasa Aesthetics
            </span>
          </Link>

          {/* Mobile Logo (Center) */}
          <Link href="/" className="md:hidden flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="relative w-10 h-10">
              <Image
                src="/images/Masasa-logo.png"
                alt="Masasa Aesthetics"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Search">
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" aria-label="Admin Access">
                <Lock className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"
                />
              )}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-3/4 max-w-sm bg-background border-r border-border p-6 shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop Products
                </Link>
                <button
                  className="text-lg font-medium hover:text-primary transition-colors text-left"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                >
                  Cart ({itemCount})
                </button>
                <Link
                  href="/admin/dashboard"
                  className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2 mt-4 pt-4 border-t border-border"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Lock className="h-4 w-4" />
                  Admin Access
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

