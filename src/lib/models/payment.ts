import { Payment } from "@/types";
import mongoose, { Schema } from "mongoose";

const TransactionParticipant = {
    _id: false,
    username: String,
    avatarUrl: String,
}

const PaymentSchema = new Schema(
    {
        userId: String,
        transactionId: String,
        usdAmount: Number,
        date: Date,
        sender: TransactionParticipant,
        receivers: [TransactionParticipant],
        tag: String,
    },
    {
        timestamps: true,
    }
);
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true });
PaymentSchema.index({ tag: 1 } );

export const PaymentModel = mongoose.models.Payment || mongoose.model<Payment>("Payment", PaymentSchema);
