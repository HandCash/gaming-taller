import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'default_secret';
const COOKIE_NAME = 'user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export class CookieAuth {
    static async setHandCashIdCookie(userId: string) {
        const jwt = await new SignJWT({ userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(new TextEncoder().encode(COOKIE_SECRET));
        cookies().set({
            name: COOKIE_NAME,
            value: jwt,
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_MAX_AGE
        });
    }

    static async getHandCashIdFromCookie(): Promise<string | null> {
        const cookieStore = cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return null;
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(COOKIE_SECRET));
            return payload.userId as string;
        } catch {
            return null;
        }
    }

    static clearUserCookie() {
        cookies().set({
            name: COOKIE_NAME,
            value: '',
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0
        });
    }
} 