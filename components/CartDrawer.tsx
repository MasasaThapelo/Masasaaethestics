'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        onClose();
        router.push('/checkout');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-background shadow-2xl sm:max-w-md border-l border-border"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Your Cart
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    {cart.length}
                                </span>
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                                    <div className="rounded-full bg-secondary p-6">
                                        <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-medium text-foreground">Your cart is empty</p>
                                        <p className="text-sm text-muted-foreground">Add some items to get started.</p>
                                    </div>
                                    <Button variant="outline" onClick={onClose} className="mt-4">
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div key={`${item.productId}-${item.customization}`} className="flex gap-4">
                                            {/* Image */}
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary/30">
                                                <Image
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="text-base font-medium text-foreground">{item.product.name}</h3>
                                                        <p className="ml-4 text-sm font-semibold">{config.currency.symbol}{item.product.price * item.quantity}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{item.product.phoneModel}</p>
                                                    {item.customization && (
                                                        <p className="text-xs text-muted-foreground italic">"{item.customization}"</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 rounded-full border border-border p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.customization)}
                                                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.customization)}
                                                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary text-foreground transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.productId, item.customization)}
                                                        className="text-muted-foreground hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="border-t border-border px-6 py-6 bg-background space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-base font-medium text-foreground">
                                        <p>Subtotal</p>
                                        <p>{config.currency.symbol}{getTotalPrice()}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                                </div>
                                <Button onClick={handleCheckout} className="w-full text-base py-6 rounded-full group">
                                    Checkout
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
