import { Document, Types } from 'mongoose';

export default interface ICustomer extends Document {
    user_id: Types.ObjectId;
    name: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    address_1?: string;
    address_2?: string;
    address_3?: string;
    country?: string;
    comment?: string;
    status: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}