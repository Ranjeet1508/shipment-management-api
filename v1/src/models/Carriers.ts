import Mongoose, {Schema} from "mongoose";

const CarrierSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        maxlength: 128,
        required: true
    },
    contact_person: {
        type: String,
        maxlength: 48
    },
    contact_phone: {
        type: String,
        maxlength: 12
    },
    contact_email: {
        type: String,
        maxlength: 128
    },
    address_1: {
        type: String,
        maxlength: 128
    },
    address_2: {
        type: String,
        maxlength: 128
    },
    address_3: {
        type: String,
        maxlength: 128
    },
    country: {
        type: String,
        maxlength: 128
    },
    comment: {
        type: String,
        maxlength: 512
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
}, {timestamps: true, versionKey: false})

CarrierSchema.index(
    { user_id: 1, createdAt: -1 },
    { partialFilterExpression: { deleted: false } }
);

CarrierSchema.index(
    { user_id: 1, name: 1 },
    { unique: true, partialFilterExpression: { deleted: false } }
);


export default Mongoose.model('carrier', CarrierSchema)