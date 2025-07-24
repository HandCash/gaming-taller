import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { PaymentModel } from "@/lib/models/payment";
import { Constants } from "@/constants";
import { UserModel } from "@/lib/models/user";
import randomName from "@scaleway/random-name";
import { minter } from "@/lib/handcash";
import { NftModel } from "@/lib/models/nft";

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (data['appSecret'] !== Constants.HandCashAppCredentials.appSecret) {
            return NextResponse.json({ message: 'Invalid app secret' }, { status: 401 });
        }

        const user = await UserModel.findOne({ handcashId: data['userData']['id'] });
        const paymentRequestId = data['paymentRequestId'];

        console.log(data)

        if (paymentRequestId === '688193a4a144bf31df752c9e') {
            let order = await minter.createItemsOrder({
                collectionId: Constants.HandCashAppCredentials.collectionId,
                items: [{
                    user: user.handcashId,
                    name: `${randomName('', '_')}`,
                    description: 'Avatar creado en el Curso de Verano de la Complutense.',
                    rarity: 'epic',
                    quantity: 1,
                    attributes: [{
                        displayType: 'string',
                        name: 'Semilla',
                        value: data['transactionId']
                    }],
                    mediaDetails: {
                        image: {
                            contentType: 'image/png',
                            url: `https://api.dicebear.com/9.x/personas/svg?seed=${data['transactionId']}`
                        }
                    },
                    actions: []
                }]
            });
            while (order.status !== 'completed') {
                order = await minter.getOrder(order.id);
            }
            const items = await minter.getOrderItems(order.id);

            await NftModel.create({
                label: 'buyNft',
                userId: user.handcashId,
                username: user.username,
                origin: items[0].origin,
                name: items[0].name,
                transactionId: items[0].origin.substring(0, items[0].origin.length - 2),
                mediaUrl: items[0].imageUrl,
                attributes: items[0].attributes,
            });
        } else {
            await PaymentModel.create({
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
        }
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}