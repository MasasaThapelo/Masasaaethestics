import Carousel from '@/components/Carousel';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { products, getUniquePhoneModels } from '@/data/products';

export default function Home() {
  const phoneModels = getUniquePhoneModels();
  const featuredProducts = products.slice(0, 6); // First 6 products for carousel

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Carousel */}
      <section className="py-12 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Custom Phone Cases
          </h1>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our beautiful collection of custom phone cases with unique designs
          </p>
          <Carousel products={featuredProducts} />
        </div>
      </section>

      {/* Phone Model Sections */}
      <section className="py-16 container mx-auto px-4">
        {phoneModels.map((phoneModel) => {
          const modelProducts = products.filter(p => p.phoneModel === phoneModel);
          return (
            <div key={phoneModel} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {phoneModel}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modelProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

