import {Document, Types} from 'mongoose';

export default interface IShipment extends Document{
    user_id: Types.ObjectId;
    pickup_time?: Date;
    loading_time?: string;
    carrier: Types.ObjectId;
    delivery_date_time?: Date;
    load_code?: string;
    destination: Types.ObjectId;
    references: string[];
    pallets?: number;
    cartons?: number;
    kilo?: number;
    arrival_time?: string;
    departure_time?: string;
    dock: Types.ObjectId;
    status: 0 | 1 | 2 | 3;
    unloading_reference?: string;
    comments?: string;
    cmr_status: boolean;
    pod_status: boolean;
    sub_shipments: Types.ObjectId[];
    is_sub_shipment: boolean;
    createdAt: Date;
    updatedAt: Date;
}