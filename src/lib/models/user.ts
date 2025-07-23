import mongoose, { Schema } from "mongoose";
import { User } from "@/types";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        handcashId: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
        },
        authToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);
