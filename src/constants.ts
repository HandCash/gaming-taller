export type HandCashParams = {
    appId: string;
    authToken: string;
    appSecret: string;
    env?: { apiEndpoint: string; clientUrl: string; trustholderEndpoint: string };
    businessWalletId: string
};

export type HandCashParamsWithAppParams = HandCashParams & {
    collectionId: string;
    cardPacksCollectionId?: string;
};

const HandCashAppCredentials: HandCashParamsWithAppParams = {
    appId: process.env.NEXT_PUBLIC_APP_ID as string,
    appSecret: process.env.APP_SECRET as string,
    authToken: process.env.AUTH_TOKEN as string,
    // env: Environments[process.env.HANDCASH_ENV as 'prod' | 'iae' | 'qae'],
    businessWalletId: process.env.BUSINESS_WALLET_ID as string,
    collectionId: process.env.COLLECTION_ID as string,
};

const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : `https://${process.env.VERCEL_URL}`;
const HandCashAppDomain = `https://${process.env.NEXT_PUBLIC_HANDCASH_APP_DOMAIN}`;

export const Constants = {
    baseUrl,
    HandCashAppDomain,
    HandCashAppCredentials
}
