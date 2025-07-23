import mongoose, { Schema } from "mongoose";

const LogEntrySchema = new Schema(
    {
        data: {
            type: Object,
        },
        message: {
            type: String,
            required: true
        },
        stack: {
            type: String,
        },
        tag: {
            type: String,
            enum: ['info', 'warning', 'error'],
            default: 'info'
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.LogEntry || mongoose.model("LogEntry", LogEntrySchema);
