import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { NftModel } from "@/lib/models/nft";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        let filters = {};
        if (url.searchParams.has('label')) {
            filters = { label: url.searchParams.get('label') };
        }
        await connectDB();
        const nfts = await NftModel.find(filters).sort({ createdAt: -1 });

        return NextResponse.json({
            items: nfts.map((nft) => ({
                username: nft.username,
                name: nft.name,
                mediaUrl: nft.mediaUrl,
                origin: nft.origin,
                transactionId: nft.transactionId,
            })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}