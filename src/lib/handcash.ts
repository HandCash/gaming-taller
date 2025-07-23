import { Constants } from "@/constants";
import { HandCashConnect, HandCashMinter } from "@handcash/handcash-connect";

export const handCash = new HandCashConnect({
    appId: Constants.HandCashAppCredentials.appId,
    appSecret: Constants.HandCashAppCredentials.appSecret,
});

export const minter = HandCashMinter.fromAppCredentials(Constants.HandCashAppCredentials);
