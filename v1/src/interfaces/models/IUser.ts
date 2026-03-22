import { Document } from 'mongoose';

interface IBillingInformation {
    company_name: string;
    registration_tax_id: string;
    vat_number?: string;
    billing_email: string;
    contact_name: string;
    phone_number?: string;
    billing_address: string;
    city: string;
    state_province?: string;
    country: string;
    postcode: string;
}

export default interface IUser extends Document {
    email: string;
    password: string;
    company_name?: string;
    contact_person?: string;
    phone_number?: string;
    country_reqion?: string;
    address?: string;
    postal_code?: string;
    logo_url?: string;
    status: boolean;
    billing_information?: IBillingInformation;
    createdAt: Date;
    updatedAt: Date;
}