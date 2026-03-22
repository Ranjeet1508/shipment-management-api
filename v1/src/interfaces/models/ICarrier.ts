import { Document, Types } from "mongoose";

export default interface ICarrier extends Document {
    user_id: Types.ObjectId;
    name: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    country?: string;
    comment?: string;
    status: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}