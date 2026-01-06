'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface CarouselProps {
  products: Product[];
}

export default function Carousel({ products }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const touchStartX = useRef(0);
  const scrollStartX = useRef(0);
  const scrollSpeed = 0.8;

  // Duplicate products for seamless infinite scroll
  const duplicatedProducts = [...products, ...products, ...products];

  // Handle touch events for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsTouching(true);
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    scrollStartX.current = scrollContainerRef.current?.scrollLeft || 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isTouching || !scrollContainerRef.current) return;
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    scrollContainerRef.current.scrollLeft = scrollStartX.current + diff;
  }, [isTouching]);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    // Resume auto-scroll after a delay
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Calculate card width based on screen size
    const getCardWidth = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        return 288 + 16; // w-72 = 288px + gap-4 = 16px on mobile
      }
      return 320 + 24; // w-80 = 320px + gap-6 = 24px on desktop
    };

    const cardWidth = getCardWidth();
    const singleSetWidth = products.length * cardWidth;
    let scrollPosition = singleSetWidth;

    const animate = () => {
      if (!isPaused && !isTouching && container) {
        scrollPosition -= scrollSpeed;
        
        if (scrollPosition <= 0) {
          scrollPosition = singleSetWidth;
          container.scrollLeft = scrollPosition;
        } else {
          container.scrollLeft = scrollPosition;
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    container.scrollLeft = scrollPosition;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, isTouching, products.length, scrollSpeed]);

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-hidden hide-scrollbar"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          willChange: 'scroll-position',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {duplicatedProducts.map((product, index) => (
          <div key={`${product.id}-${index}`} className="flex-shrink-0 w-72 sm:w-80">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

