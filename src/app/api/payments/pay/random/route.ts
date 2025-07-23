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

        const randomUser = await UserModel.aggregate([
            // { $match: { handcashId: { $ne: userId } } },
            { $match: {} },
            { $sample: { size: 1 } }
        ]).then((users) => users[0]);

        const account = await handCash.getAccountFromAuthToken(user.authToken);
        const result = await account.wallet.pay({
            description: 'Random payment',
            payments: [{
                destination: randomUser.handcashId,
                currencyCode: 'USD',
                sendAmount: 0.01,
            }],
        });

        const paymentRecord = await PaymentModel.create({
            userId,
            sender: {
                username: user.username,
                avatarUrl: user.avatarUrl,
            },
            receivers: [{
                username: randomUser.username,
                avatarUrl: randomUser.avatarUrl,
            }],
            usdAmount: 0.01,
            transactionId: result.transactionId,
            tag: 'tip'
        });

        return NextResponse.json(paymentRecord);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}