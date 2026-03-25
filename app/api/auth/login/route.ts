import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const sessionSecret = process.env.SESSION_SECRET || 'fallback_secret';

        if (email === adminEmail && password === adminPassword) {
            // Return a simple session token
            return NextResponse.json({
                success: true,
                token: `session_${sessionSecret}`
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Invalid credentials'
        }, { status: 401 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}
