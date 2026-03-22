import Mongoose, {Schema} from "mongoose";

const ShipmentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    pickup_time: {
        type: Date
    },
    loading_time: {
        type: String,
        maxlength: 5
    },
    carrier: {
        type: Schema.Types.ObjectId,
        ref: 'carrier',
        required: true
    },
    delivery_date_time: {
        type: Date
    },
    load_code: {
        type: String,
        maxlength: 128
    },
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    references: {
        type: [String],
        validate: {
            validator: (arr: string[]) => arr.every(ref => ref.length < 1024),
            message: 'Each reference must be at most 1024 character long'
        },
        default: []
    },
    pallets: {
        type: Number
    },
    cartons: {
        type: Number,
    },
    kilo: {
        type: Number
    },
    arrival_time: {
        type: String,
        maxlength: 5
    },
    departure_time: {
        type: String,
        maxlength: 5
    },
    dock: {
        type: Schema.Types.ObjectId,
        ref: 'dock',
        required: true
    },
    status: {
        type: Number,
        enum: [0,1,2,3,],
        default: 0
    },
    unloading_reference: {
        type: String,
        maxlength: 512
    },
    comments: {
        type: String,
        maxlength: 512
    },
    cmr_status: {
        type: Boolean,
        default: false
    },
    pod_status: {
        type: Boolean,
        default: false
    },
    sub_shipments: {
        type: [Schema.Types.ObjectId],
        ref: 'shipment',
        required: false,
    },
    is_sub_shipment: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false})


//Base filter + sort indexing
ShipmentSchema.index(
    {user_id: 1, is_sub_shipment: 1, createdAt: -1},
    {partialFilterExpression: {is_sub_shipment: false}}
);

ShipmentSchema.index(
    {user_id: 1, is_sub_shipment: 1, pickup_time: 1},
    {partialFilterExpression: {is_sub_shipment: false}}
)

ShipmentSchema.index(
    { user_id: 1, is_sub_shipment: 1, delivery_date_time: 1 },
    { partialFilterExpression: { is_sub_shipment: false } }
);

ShipmentSchema.index(
    { user_id: 1, is_sub_shipment: 1, load_code: 1, createdAt: -1 },
    { partialFilterExpression: { is_sub_shipment: false } }
);

ShipmentSchema.index(
    { user_id: 1, is_sub_shipment: 1, cmr_status: 1, createdAt: -1 },
    { partialFilterExpression: { is_sub_shipment: false } }
);
ShipmentSchema.index(
    { user_id: 1, is_sub_shipment: 1, pod_status: 1, createdAt: -1 },
    { partialFilterExpression: { is_sub_shipment: false } }
);

export default Mongoose.model('shipment', ShipmentSchema)