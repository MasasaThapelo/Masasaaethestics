'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  productId: string;
  product: Product;
  customization: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isHydrated: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, customization?: string) => void;
  updateQuantity: (productId: string, quantity: number, customization?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.productId === item.productId && cartItem.customization === item.customization
      );
      
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.productId === item.productId && cartItem.customization === item.customization
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prevCart, item];
    });
  };

  const removeFromCart = (productId: string, customization: string = '') => {
    setCart((prevCart) => 
      prevCart.filter((item) => 
        !(item.productId === productId && item.customization === customization)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, customization: string = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, customization);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.customization === customization
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isHydrated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

