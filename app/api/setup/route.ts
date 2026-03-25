import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint creates the required tables and storage buckets
export async function POST() {
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const results: string[] = [];

    try {
        // Try creating the products table using RPC (raw SQL)
        // First, let's test if the table exists
        const { error: testError } = await supabase.from('products').select('id').limit(1);

        if (testError && testError.message.includes('does not exist')) {
            results.push('⚠️ Products table does not exist. Please create it in Supabase Dashboard.');
            results.push('');
            results.push('Go to your Supabase Dashboard → SQL Editor → New Query and run:');
            results.push('');
            results.push(`CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  "phoneModel" TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 200,
  "imageUrl" TEXT NOT NULL,
  description TEXT DEFAULT '',
  "isLive" BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write access" ON products FOR ALL USING (true);`);

            results.push('');
            results.push('Also create the orders table if not done:');
            results.push(`CREATE TABLE IF NOT EXISTS orders (
  "orderId" TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  "postalCode" TEXT DEFAULT '',
  country TEXT DEFAULT '',
  "paxiCode" TEXT DEFAULT '',
  "paxiFeeConfirmed" BOOLEAN DEFAULT false,
  items JSONB DEFAULT '[]',
  subtotal NUMERIC DEFAULT 0,
  "paxiFee" NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON orders FOR ALL USING (true);`);

            results.push('');
            results.push('And create the storage bucket:');
            results.push('Go to Supabase Dashboard → Storage → New Bucket → Name: "product-images" → Make it public');
        } else if (testError) {
            results.push('Error testing products table: ' + testError.message);
        } else {
            results.push('✅ Products table already exists!');
        }

        // Test orders table
        const { error: ordersError } = await supabase.from('orders').select('*').limit(1);
        if (ordersError && ordersError.message.includes('does not exist')) {
            results.push('⚠️ Orders table does not exist (SQL provided above)');
        } else if (!ordersError) {
            results.push('✅ Orders table already exists!');
        }

        return NextResponse.json({ results }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message, results }, { status: 500 });
    }
}
