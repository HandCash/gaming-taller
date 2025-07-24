import connectDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { handCash, minter } from "@/lib/handcash";
import { getAuthenticatedUserOrThrow, UnauthorizedError } from "../../ApiInteractor";
import { redirect } from "next/navigation";
import { Constants } from "@/constants";

export async function GET(req: Request) {
    try {
        const user = await getAuthenticatedUserOrThrow();

        await connectDB();
        const account = await handCash.getAccountFromAuthToken((await user).authToken);
        const items = await account.items.getItemsInventory({
            groupingValue: 'd4f5e088af956a5426d004edefc5b28f'
        });

        if (items.length === 0) {
            throw new Error('No items in the inventory');
        }

        const result = await minter.burnAndCreateItemsOrder({
            burn: {
                origins: [items[0].origin],
            },
            issue: {
                collectionId: Constants.HandCashAppCredentials.collectionId,
                items: [{
                    user: user.handcashId,
                    name: 'Diploma del Curso',
                    description: 'Diploma del Curso de Gamificación y Blockchain',
                    rarity: 'leyendary',
                    quantity: 1,
                    attributes: [
                        {
                            displayType: 'string',
                            name: 'Fecha',
                            value: '24 Jul 2025'
                        },
                        {
                            displayType: 'string',
                            name: 'Entidad',
                            value: 'Universidad Complutense de Madrid'
                        },
                        {
                            displayType: 'string',
                            name: 'Usuario',
                            value: user.username
                        }
                    ],
                    mediaDetails: {
                        image: {
                            contentType: 'image/png',
                            url: Constants.baseUrl + '/diploma.png'
                        }
                    },
                    actions: []
                }]
            }
        });
        let order = result.itemCreationOrder;
        while (order.status !== 'completed') {
            order = await minter.getOrder(order.id);
        }
        return NextResponse.json({});
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return redirect('/1/connect');
        }
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}