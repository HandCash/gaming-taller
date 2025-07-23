import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { PaymentModel } from "@/lib/models/payment";
import { Constants } from "@/constants";
import { UserModel } from "@/lib/models/user";

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (data['appSecret'] !== Constants.HandCashAppCredentials.appSecret) {
            return NextResponse.json({ message: 'Invalid app secret' }, { status: 401 });
        }

        const user = await UserModel.findOne({ handcashId: data['userData']['id'] });

        const paymentRecord = await PaymentModel.create({
            userId: user.handcashId,
            sender: {
                username: user.username,
                avatarUrl: user.avatarUrl,
            },
            receivers: [{
                username: 'bw0686d0a4ad161fe48b7461bc8',
                avatarUrl: 'https://pbs.twimg.com/profile_images/1853594798592049152/o5Ocr7Mz_400x400.jpg',
            }],
            usdAmount: 0.01,
            transactionId: data['transactionId'],
            tag: 'avatar'
        });

        return NextResponse.json(paymentRecord);
    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}