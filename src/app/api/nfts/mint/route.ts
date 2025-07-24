import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { minter } from "@/lib/handcash";
import { Constants } from "@/constants";
import { getAuthenticatedUserOrThrow, UnauthorizedError } from "../../ApiInteractor";
import { redirect } from "next/navigation";
import { NftModel } from "@/lib/models/nft";
import randomName from '@scaleway/random-name';

export async function POST(req: Request) {
    try {
        await connectDB();

        const user = await getAuthenticatedUserOrThrow();
        const data = await req.json();

        const attributes = data['attributes'];
        const mediaUrl = data['mediaUrl'];
        if (!Array.isArray(attributes)) {
            return NextResponse.json({ error: 'Invalid attributes' }, { status: 500 });
        }

        let order = await minter.createItemsOrder({
            collectionId: Constants.HandCashAppCredentials.collectionId,
            items: [{
                user: user.handcashId,
                name: `${randomName('', '_')}`,
                description: 'Avatar creado en el Curso de Verano de la Complutense.',
                rarity: 'epic',
                quantity: 1,
                attributes: attributes.map((p) => ({
                    displayType: 'string',
                    name: p.name,
                    value: p.value
                })),
                mediaDetails: {
                    image: {
                        contentType: 'image/png',
                        url: mediaUrl
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
            label: 'avatar',
            userId: user.handcashId,
            username: user.username,
            origin: items[0].origin,
            name: items[0].name,
            transactionId: items[0].origin.substring(0, items[0].origin.length - 2),
            mediaUrl: items[0].imageUrl,
            attributes: attributes,
        });

        // const order = await minter.createItemsOrder({
        //     collectionId: Constants.HandCashAppCredentials.collectionId,
        //     items: [{
        //         user: user.handcashId,
        //         name: 'Caja Misteriosa',
        //         description: 'Nadie conoce su contenido, pero podría ser útil!',
        //         rarity: 'epic',
        //         quantity: 1,
        //         attributes: [
        //             {
        //                 displayType: 'number',
        //                 name: 'Peso (g)',
        //                 value: 0.25
        //             },
        //             {
        //                 displayType: 'string',
        //                 name: 'Origen',
        //                 value: 'Universidad Complutense'
        //             }
        //         ],
        //         mediaDetails: {
        //             image: {
        //                 contentType: 'image/png',
        //                 url: `${Constants.baseUrl}/mystery-box.png`
        //             }
        //         },
        //         actions: []
        //     }]
        // });
        return NextResponse.json({ order });
    } catch (error) {
        console.error(error);
        if (error instanceof UnauthorizedError) {
            return redirect('/connect');
        }
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}