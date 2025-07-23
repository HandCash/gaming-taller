import { CookieAuth } from "@/lib/utils/cookieAuth";
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
    CookieAuth.clearUserCookie();

    return redirect('/1/connect');
} 