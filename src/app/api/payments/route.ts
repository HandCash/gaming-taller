import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { PaymentModel } from "@/lib/models/payment";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        let filters = {};
        if (url.searchParams.has('tag')) {
            filters = { tag: url.searchParams.get('tag') };
        }
        await connectDB();
        const payments = await PaymentModel.find(filters).sort({ updatedAt: -1 });

        return NextResponse.json({
            items: payments.map((payment) => ({
                transactionId: payment.transactionId,
                usdAmount: payment.usdAmount,
                date: payment.date,
                sender: payment.sender,
                receivers: payment.receivers,
            })),
        });
    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}