import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from "@/lib/models/user";
import { CookieAuth } from '@/lib/utils/cookieAuth';
import { HandCashConnect } from "@handcash/handcash-connect";
import { Constants } from "@/constants";
import { redirect, RedirectType } from "next/navigation";
import { minter } from "@/lib/handcash";

const handCash = new HandCashConnect({
    appId: Constants.HandCashAppCredentials.appId,
    appSecret: Constants.HandCashAppCredentials.appSecret,
});

async function sendInitialPayment(handle: string) {
    const businessAccount = handCash.getAccountFromAuthToken(Constants.HandCashAppCredentials.authToken);
    await businessAccount.wallet.pay({
        description: 'Bienvenido a blockchain!',
        payments: [{
            destination: handle,
            currencyCode: 'USD',
            sendAmount: 1,
        }],
    });
}

async function sendInitialNft(userId: string, userHandle: string) {
    let order = await minter.createItemsOrder({
        collectionId: Constants.HandCashAppCredentials.collectionId,
        items: [{
            user: userId,
            name: 'Mystery box',
            description: 'Caja misteriosa. Se desconoce su contenido.',
            rarity: 'epic',
            quantity: 1,
            attributes: [{
                displayType: 'string',
                name: 'OriginalOwner',
                value: `$${userHandle}`
            }],
            mediaDetails: {
                image: {
                    contentType: 'image/png',
                    url: Constants.baseUrl + '/mystery-box.png'
                }
            },
            actions: []
        }]
    });
    while (order.status !== 'completed') {
        order = await minter.getOrder(order.id);
    }
}

async function insertOrUpdateUser(authToken: string) {
    const account = handCash.getAccountFromAuthToken(authToken);
    const profile = await account.profile.getCurrentProfile();
    const { avatarUrl, handle, id } = profile.publicProfile;
    const existingUser = await UserModel.findOne({ handcashId: id });
    if (!existingUser) {
        await sendInitialNft(id, handle);
    }
    return await UserModel.findOneAndUpdate({ handcashId: id }, { username: handle, handcashId: id, avatarUrl, authToken }, { upsert: true, new: true });
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const authToken = req.nextUrl.searchParams.get('authToken');
        if (authToken) {
            const user = await insertOrUpdateUser(authToken);
            await CookieAuth.setHandCashIdCookie(user.handcashId);
        }
    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
    return redirect(`/2/welcome`, RedirectType.replace);
}