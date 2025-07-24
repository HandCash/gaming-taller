import { Nft } from "@/types";
import mongoose, { Schema } from "mongoose";

const NftSchema = new Schema(
    {
        userId: String,
        username: String,
        origin: String,
        transactionId: String,
        mediaUrl: String,
        name: String,
        attributes: [
            {
                name: String,
                value: String
            }
        ]
    },
    {
        timestamps: true,
    }
);
NftSchema.index({ userId: 1 });
NftSchema.index({ origin: 1 }, { unique: true });

export const NftModel = mongoose.models.Nft || mongoose.model<Nft>("Nft", NftSchema);
