import { UserModel } from "@/lib/models/user";
import { CookieAuth } from "@/lib/utils/cookieAuth";
import { User } from "@/types";
import { NextResponse } from "next/server";

export async function getAuthenticatedUserOrThrow(): Promise<User> {
    const userId = await CookieAuth.getHandCashIdFromCookie();
    if (!userId) {
        throw new UnauthorizedError();
    }
    const user = await UserModel.findOne({ handcashId: userId });
    if (!user) {
        throw new UnauthorizedError();
    }
    return user;
}

export class UnauthorizedError extends Error {

}