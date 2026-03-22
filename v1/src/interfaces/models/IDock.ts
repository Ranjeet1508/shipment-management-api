import { Document, Types } from 'mongoose';

export default interface IDock extends Document {
    user_id: Types.ObjectId;
    name: string;
    purpose?: string;
    comment?: string;
    availability: boolean;
    status: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}