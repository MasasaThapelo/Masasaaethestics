'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 md:py-4">
        {/* Mobile Header - Centered Logo */}
        <div className="flex md:hidden items-center justify-between">
          {/* Hamburger menu button - left */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-gold transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Centered Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/Masasa-logo.png"
              alt="Masasa Aesthetics Logo"
              width={100}
              height={100}
              className="object-contain drop-shadow-lg"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}
            />
          </Link>

          {/* Cart icon - right */}
          <Link href="/cart" className="text-gray-700 hover:text-gold transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity z-10">
            <Image
              src="/images/Masasa-logo.png"
              alt="Masasa Aesthetics Logo"
              width={80}
              height={80}
              className="object-contain drop-shadow-lg"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}
            />
          </Link>

          {/* Brand name - centered on desktop */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 hover:opacity-90 transition-opacity">
            <span className="text-2xl lg:text-4xl font-extrabold text-gold tracking-wide drop-shadow-md">
              Masasa Aesthetics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex gap-6 items-center">
            <Link href="/products" className="text-gray-700 hover:text-gold transition-colors font-medium">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-gold transition-colors relative font-medium">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gold font-bold text-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Masasa Aesthetics
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-gold transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-700 hover:text-gold transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
                {itemCount > 0 && (
                  <span className="bg-gold text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                    {itemCount} items
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

