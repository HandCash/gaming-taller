import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { UserModel } from "@/lib/models/user";
import { CookieAuth } from '@/lib/utils/cookieAuth';
import { PaymentModel } from "@/lib/models/payment";
import { handCash } from "@/lib/handcash";

export async function GET(req: Request) {
    try {
        await connectDB();
        const userId = await CookieAuth.getHandCashIdFromCookie();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = await UserModel.findOne({ handcashId: userId });
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // const users = await UserModel.find({ handcashId: { $ne: userId } });
        const users = await UserModel.find({});

        const account = await handCash.getAccountFromAuthToken(user.authToken);
        const amountPerUser = parseFloat((0.05 / users.length).toFixed(2));
        const result = await account.wallet.pay({
            description: 'Paying all users',
            payments: users.map(user => ({
                destination: user.handcashId,
                currencyCode: 'USD',
                sendAmount: amountPerUser,
            })),
        });

        const paymentRecord = await PaymentModel.create({
            userId,
            sender: {
                username: user.username,
                avatarUrl: user.avatarUrl,
            },
            receivers: users.map(user => ({
                username: user.username,
                avatarUrl: user.avatarUrl,
            })),
            usdAmount: 0.05,
            transactionId: result.transactionId,
            tag: 'tip'
        });

        return NextResponse.json(paymentRecord);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}