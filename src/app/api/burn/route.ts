import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { minter } from "@/lib/handcash";
import { Constants } from "@/constants";
import { getAuthenticatedUserOrThrow, UnauthorizedError } from "../ApiInteractor";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
    try {
        await connectDB();

        const user = await getAuthenticatedUserOrThrow();
        return NextResponse.json({ user });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return redirect('/connect');
        }
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}