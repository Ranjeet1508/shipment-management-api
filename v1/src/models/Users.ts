import Mongoose, {Schema} from 'mongoose'


const BillingInformationSchema = new Schema({
    company_name: {type: String, maxLength: 128, required: true},
    registration_tax_id: {type: String, maxLength: 48, required: true},
    vat_number: {type: String, maxLength: 48},
    billing_email: {type: String, maxLength: 128, required: true},
    contact_name: {type: String, maxLength: 128, required: true},
    phone_number: {type: String, maxLength: 20},
    billing_address: {type: String, maxLength: 256, required: true},
    city: {type: String, maxLength: 128, required: true},
    state_province: {type: String, maxLength: 128},
    country: {type: String, maxLength: 128, required: true},
    postcode: {type: String, maxLength: 48, required: true}
}, {_id: false})


const UserSchema = new Schema({
    email: {type: String, required:true, unique: true, maxLength: 128, index: true},
    password: {type: String, maxLength: 24, required: true},
    company_name: {type: String, maxLength: 128},
    contact_person: {type: String, maxLength: 128},
    phone_number: {type: String, maxLength: 12},
    country_region: {type: String, maxLength: 128},
    address: {type: String, maxLength: 256},
    postal_code: {type: String, maxLength: 12},
    logo_url: {type: String, maxLength: 1024},
    status: {type: Boolean, default: true},
    billing_information: {type: BillingInformationSchema},
},  {timestamps: true, versionKey: false})

export default Mongoose.model("user", UserSchema)