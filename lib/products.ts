import { supabase } from './supabase';

export interface Product {
    id: string;
    name: string;
    category: string;
    phoneModel: string;
    price: number;
    imageUrl: string;
    description?: string;
    isLive: boolean;
    position: number;
    createdAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt'>;

// --- READ ---

export async function getAllProducts(): Promise<Product[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data || [];
}

export async function getLiveProducts(): Promise<Product[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('isLive', true)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching live products:', error);
        return [];
    }
    return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }
    return data;
}

export function getUniquePhoneModels(products: Product[]): string[] {
    return Array.from(new Set(products.map(p => p.phoneModel)));
}

// --- CREATE ---

export async function createProduct(product: ProductFormData): Promise<Product | null> {
    if (!supabase) return null;
    const newProduct = {
        ...product,
        id: generateProductId(product.name, product.phoneModel),
        createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        return null;
    }
    return data;
}

// --- UPDATE ---

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        return null;
    }
    return data;
}

export async function updateProductPositions(updates: { id: string; position: number; isLive: boolean }[]): Promise<boolean> {
    if (!supabase) return false;

    // Use a batch of individual updates
    const promises = updates.map(({ id, position, isLive }) =>
        supabase!.from('products').update({ position, isLive }).eq('id', id)
    );

    const results = await Promise.all(promises);
    const hasError = results.some(r => r.error);
    if (hasError) {
        console.error('Error updating positions:', results.filter(r => r.error));
        return false;
    }
    return true;
}

// --- DELETE ---

export async function deleteProduct(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return false;
    }
    return true;
}

// --- IMAGE UPLOAD ---

export async function uploadProductImage(file: File): Promise<string | null> {
    if (!supabase) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}

// --- HELPERS ---

function generateProductId(name: string, phoneModel: string): string {
    const slug = `${phoneModel}-${name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const rand = Math.random().toString(36).substring(2, 6);
    return `${slug}-${rand}`;
}

// --- SEED (migrate existing static data) ---

export async function seedProductsFromStatic(): Promise<boolean> {
    if (!supabase) return false;

    // Check if products already exist
    const { data: existing } = await supabase
        .from('products')
        .select('id')
        .limit(1);

    if (existing && existing.length > 0) {
        console.log('Products already seeded');
        return true;
    }

    // Import static products
    const { products: staticProducts } = await import('@/data/products');

    const productsToInsert = staticProducts.map((p, index) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        phoneModel: p.phoneModel,
        price: p.price,
        imageUrl: p.imageUrl,
        description: p.description || '',
        isLive: true,
        position: index,
        createdAt: new Date().toISOString(),
    }));

    const { error } = await supabase
        .from('products')
        .insert(productsToInsert);

    if (error) {
        console.error('Error seeding products:', error);
        return false;
    }

    console.log(`Seeded ${productsToInsert.length} products`);
    return true;
}
