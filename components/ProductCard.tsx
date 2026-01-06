import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <div className="relative w-full h-64 bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.phoneModel}</p>
          <p className="text-xl font-bold text-gray-900">R{product.price}</p>
          <button className="mt-3 w-full bg-gold text-white py-2 px-4 rounded-md hover:bg-gold-700 transition-colors font-medium">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}

