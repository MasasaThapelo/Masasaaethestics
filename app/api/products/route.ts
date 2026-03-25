import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all products (or filtered by ?live=true)
export async function GET(request: NextRequest) {
    if (!supabase) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const liveOnly = searchParams.get('live') === 'true';

    let query = supabase.from('products').select('*').order('position', { ascending: true });
    if (liveOnly) {
        query = query.eq('isLive', true);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST — Create or seed products
export async function POST(request: NextRequest) {
    if (!supabase) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Seed action
        if (body.action === 'seed') {
            const { data: existing } = await supabase.from('products').select('id').limit(1);
            if (existing && existing.length > 0) {
                return NextResponse.json({ message: 'Products already seeded', seeded: false });
            }

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

            const { error } = await supabase.from('products').insert(productsToInsert);
            if (error) throw error;

            return NextResponse.json({ message: `Seeded ${productsToInsert.length} products`, seeded: true });
        }

        // Create single product
        const { data, error } = await supabase
            .from('products')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT — Update product or batch update positions
export async function PUT(request: NextRequest) {
    if (!supabase) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Batch position update
        if (body.action === 'updatePositions' && Array.isArray(body.updates)) {
            const promises = body.updates.map(({ id, position, isLive }: any) =>
                supabase!.from('products').update({ position, isLive }).eq('id', id)
            );
            const results = await Promise.all(promises);
            const hasError = results.some((r: any) => r.error);
            if (hasError) throw new Error('Failed to update some positions');

            return NextResponse.json({ success: true });
        }

        // Single product update
        if (body.id) {
            const { id, ...updates } = body;
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE — Remove a product
export async function DELETE(request: NextRequest) {
    if (!supabase) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    try {
        const { id } = await request.json();
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
