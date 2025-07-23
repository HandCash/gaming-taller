import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { UserModel } from "@/lib/models/user";


export async function GET(req: Request) {
    try {
        await connectDB();
        const users = await UserModel.find({}).sort({ updatedAt: -1 });

        console.log(users);

        return NextResponse.json({
            items: users.map((user) => ({
                username: user.username,
                avatarUrl: user.avatarUrl,
            })),
        }, {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}