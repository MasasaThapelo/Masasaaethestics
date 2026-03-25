'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/30">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Quick Action Button */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button className="w-full bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-xl font-medium">
              View Details
            </Button>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.phoneModel}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">R{product.price}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
