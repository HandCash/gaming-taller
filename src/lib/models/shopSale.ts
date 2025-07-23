import mongoose, { Schema } from "mongoose";

const ShopSale = new Schema(
    {
        itemTransactionId: {
            type: String,
        },
        paymentTransactionId: {
            type: String,
            required: true
        },
        itemOrigin: {
            type: String,
        },
        userId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

ShopSale.index({ paymentTransactionId: 1 }, { unique: true });

export default mongoose.models.ShopSale || mongoose.model("ShopSale", ShopSale);
