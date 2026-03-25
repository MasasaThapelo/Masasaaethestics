import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const sessionSecret = process.env.SESSION_SECRET || 'fallback_secret';

        // Debug log (Check your terminal where npm run dev is running)
        console.log('--- LOGIN DEBUG ---');
        console.log('Received email:', email?.trim(), `(len: ${email?.trim().length})`);
        console.log('Configured email:', adminEmail, `(len: ${adminEmail?.length})`);
        console.log('Received password len:', password?.length);
        console.log('Configured password len:', adminPassword?.length);
        console.log('Password match:', password === adminPassword);

        if (password !== adminPassword && adminPassword) {
            console.log('Mismatch details:');
            console.log('Configured password starts with:', adminPassword.substring(0, 1));
            console.log('Configured password ends with:', adminPassword.substring(adminPassword.length - 1));
        }
        console.log('--- END DEBUG ---');

        if (email?.trim() === adminEmail && password === adminPassword) {
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
