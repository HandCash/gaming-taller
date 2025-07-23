import mongoose from 'mongoose';

export interface ILock {
    name: string;
    expiresAt: Date;
}

const lockSchema = new mongoose.Schema<ILock>({
    name: { 
        type: String, 
        required: true,
        unique: true
    },
    expiresAt: { 
        type: Date, 
        required: true,
        index: { expires: 0 }
    }
});

const Lock = mongoose.models.Lock || mongoose.model<ILock>('Lock', lockSchema);
export default Lock; 