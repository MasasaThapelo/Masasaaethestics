// Shared type definitions for the application

import { Product } from '@/data/products';

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  customization: string;
  quantity: number;
}

// Order types
export interface OrderItem {
  productId: string;
  product: {
    id: string;
    name: string;
    category: string;
    phoneModel: string;
    price: number;
    imageUrl: string;
    description?: string;
  };
  customization: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paxiCode?: string;
  paxiFeeConfirmed?: boolean;
  items: OrderItem[];
  subtotal: number;
  paxiFee: number;
  total: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface CreateOrderRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paxiCode?: string;
  paxiFeeConfirmed?: boolean;
  items: CartItem[];
  subtotal: number;
  paxiFee: number;
  total: number;
}

// Checkout form types
export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paxiCode: string;
  paxiFeeConfirmed: boolean;
}

// Form validation types
export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  paxiCode?: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  success: boolean;
}
