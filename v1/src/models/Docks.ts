import Mongoose, {Schema} from 'mongoose'

const DocksSchema = new Schema({
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
    purpose: {
        type: String,
        maxlength: 128
    },
    comment: {
        type: String,
        maxlength: 512,
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
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
    }
}, {timestamps: true, versionKey: false})

DocksSchema.index(
    {user_id: 1, deleted: 1, createdAt: -1},
    {partialFilterExpression: {deleted: false}}
)

DocksSchema.index(
    { user_id: 1, deleted: 1, status: 1, createdAt: -1 },
    { partialFilterExpression: { deleted: false } }
);

DocksSchema.index(
    { user_id: 1, name: 1 },
    { unique: true, partialFilterExpression: { deleted: false } }
);

export default Mongoose.model('dock', DocksSchema)

