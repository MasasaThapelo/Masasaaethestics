import { NextResponse } from 'next/server';

export const COOKIE_NAME = 'admin_session';

export function setSession(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(COOKIE_NAME, token);
    }
}

export function getSession() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(COOKIE_NAME);
    }
    return null;
}

export function clearSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(COOKIE_NAME);
    }
}

export function isValidSession(token: string) {
    // For now, we use a simple secret-based token verification
    // In a real app, this would be a JWT
    const secret = process.env.SESSION_SECRET || 'fallback_secret';
    return token === `session_${secret}`;
}
