export type ProductCategory = 'Botanical Blossom' | 'White Heaven' | 'Strawberry Shortcake';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  phoneModel: string;
  price: number;
  imageUrl: string;
  description?: string;
}

// Available product images
const availableImages = [
  '/images/black1.JPG',
  '/images/black2.JPG',
  '/images/black3.JPG',
  '/images/black4.JPG',
  '/images/black5.JPG',
  '/images/white1.JPG',
  '/images/white2.JPG',
  '/images/white3.JPG',
];

// Shuffled image indices for random distribution across products
// This ensures all images are used while maintaining randomness
const shuffledIndices = [3, 7, 1, 5, 2, 0, 6, 4, 3, 1, 7, 2, 5, 4, 0, 6, 1, 3];

// Helper function to get a random image based on product index
function getRandomImage(index: number): string {
  // Use shuffled indices to distribute images randomly across products
  return availableImages[shuffledIndices[index % shuffledIndices.length]];
}

export const products: Product[] = [
  // iPhone 15 Pro - Botanical Blossom
  {
    id: 'iphone15pro-botanical',
    name: 'Botanical Blossom',
    category: 'Botanical Blossom',
    phoneModel: 'iPhone 15 Pro',
    price: 200,
    imageUrl: getRandomImage(0),
    description: 'Beautiful botanical design with floral patterns',
  },
  // iPhone 15 Pro - White Heaven
  {
    id: 'iphone15pro-white',
    name: 'White Heaven',
    category: 'White Heaven',
    phoneModel: 'iPhone 15 Pro',
    price: 200,
    imageUrl: getRandomImage(1),
    description: 'Elegant white design with minimalist aesthetic',
  },
  // iPhone 15 Pro - Strawberry Shortcake
  {
    id: 'iphone15pro-strawberry',
    name: 'Strawberry Shortcake',
    category: 'Strawberry Shortcake',
    phoneModel: 'iPhone 15 Pro',
    price: 200,
    imageUrl: getRandomImage(2),
    description: 'Sweet strawberry design with playful patterns',
  },
  // iPhone 15 - Botanical Blossom
  {
    id: 'iphone15-botanical',
    name: 'Botanical Blossom',
    category: 'Botanical Blossom',
    phoneModel: 'iPhone 15',
    price: 200,
    imageUrl: getRandomImage(3),
    description: 'Beautiful botanical design with floral patterns',
  },
  // iPhone 15 - White Heaven
  {
    id: 'iphone15-white',
    name: 'White Heaven',
    category: 'White Heaven',
    phoneModel: 'iPhone 15',
    price: 200,
    imageUrl: getRandomImage(4),
    description: 'Elegant white design with minimalist aesthetic',
  },
  // iPhone 15 - Strawberry Shortcake
  {
    id: 'iphone15-strawberry',
    name: 'Strawberry Shortcake',
    category: 'Strawberry Shortcake',
    phoneModel: 'iPhone 15',
    price: 200,
    imageUrl: getRandomImage(5),
    description: 'Sweet strawberry design with playful patterns',
  },
  // iPhone 14 Pro - Botanical Blossom
  {
    id: 'iphone14pro-botanical',
    name: 'Botanical Blossom',
    category: 'Botanical Blossom',
    phoneModel: 'iPhone 14 Pro',
    price: 200,
    imageUrl: getRandomImage(6),
    description: 'Beautiful botanical design with floral patterns',
  },
  // iPhone 14 Pro - White Heaven
  {
    id: 'iphone14pro-white',
    name: 'White Heaven',
    category: 'White Heaven',
    phoneModel: 'iPhone 14 Pro',
    price: 200,
    imageUrl: getRandomImage(7),
    description: 'Elegant white design with minimalist aesthetic',
  },
  // iPhone 14 Pro - Strawberry Shortcake
  {
    id: 'iphone14pro-strawberry',
    name: 'Strawberry Shortcake',
    category: 'Strawberry Shortcake',
    phoneModel: 'iPhone 14 Pro',
    price: 200,
    imageUrl: getRandomImage(0),
    description: 'Sweet strawberry design with playful patterns',
  },
  // Samsung Galaxy S23 - Botanical Blossom
  {
    id: 's23-botanical',
    name: 'Botanical Blossom',
    category: 'Botanical Blossom',
    phoneModel: 'Samsung Galaxy S23',
    price: 200,
    imageUrl: getRandomImage(1),
    description: 'Beautiful botanical design with floral patterns',
  },
  // Samsung Galaxy S23 - White Heaven
  {
    id: 's23-white',
    name: 'White Heaven',
    category: 'White Heaven',
    phoneModel: 'Samsung Galaxy S23',
    price: 200,
    imageUrl: getRandomImage(2),
    description: 'Elegant white design with minimalist aesthetic',
  },
  // Samsung Galaxy S23 - Strawberry Shortcake
  {
    id: 's23-strawberry',
    name: 'Strawberry Shortcake',
    category: 'Strawberry Shortcake',
    phoneModel: 'Samsung Galaxy S23',
    price: 200,
    imageUrl: getRandomImage(3),
    description: 'Sweet strawberry design with playful patterns',
  },
  // Samsung Galaxy S24 - Botanical Blossom
  {
    id: 's24-botanical',
    name: 'Botanical Blossom',
    category: 'Botanical Blossom',
    phoneModel: 'Samsung Galaxy S24',
    price: 200,
    imageUrl: getRandomImage(4),
    description: 'Beautiful botanical design with floral patterns',
  },
  // Samsung Galaxy S24 - White Heaven
  {
    id: 's24-white',
    name: 'White Heaven',
    category: 'White Heaven',
    phoneModel: 'Samsung Galaxy S24',
    price: 200,
    imageUrl: getRandomImage(5),
    description: 'Elegant white design with minimalist aesthetic',
  },
  // Samsung Galaxy S24 - Strawberry Shortcake
  {
    id: 's24-strawberry',
    name: 'Strawberry Shortcake',
    category: 'Strawberry Shortcake',
    phoneModel: 'Samsung Galaxy S24',
    price: 200,
    imageUrl: getRandomImage(6),
    description: 'Sweet strawberry design with playful patterns',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter(product => product.category === category);
}

export function getProductsByPhoneModel(phoneModel: string): Product[] {
  return products.filter(product => product.phoneModel === phoneModel);
}

export function getUniquePhoneModels(): string[] {
  return Array.from(new Set(products.map(product => product.phoneModel)));
}

