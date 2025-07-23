import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { getAuthenticatedUserOrThrow, UnauthorizedError } from "../../ApiInteractor";

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUserOrThrow();

        return NextResponse.json({
            username: user.username,
            avatarUrl: user.avatarUrl,
            handcashId: user.handcashId,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Authenticated' }, { status: 401 });    
        }
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
} 