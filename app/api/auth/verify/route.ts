import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        const sessionSecret = process.env.SESSION_SECRET || 'fallback_secret';

        if (token === `session_${sessionSecret}`) {
            return NextResponse.json({ valid: true });
        }

        return NextResponse.json({ valid: false }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
