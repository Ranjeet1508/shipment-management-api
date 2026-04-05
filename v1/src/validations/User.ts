import Joi from 'joi'

const create = Joi.object({
    email: Joi.string().email().max(128).required(),
    password: Joi.string().max(64).required(),
    company_name: Joi.string().max(128).required(),
    contact_person: Joi.string().max(128).required(),
    phone_number: Joi.string().max(13).required()
})

const login = Joi.object({
    email: Joi.string().email().max(128).required(),
    password: Joi.string().max(24).required()
})

const changePassword = Joi.object({
    password: Joi.string().max(24).required(),
})

const updateBillingInformation = Joi.object({
    company_name: Joi.string().max(128).required(),
    registration_tax_id: Joi.string().max(48).required(),
    vat_number: Joi.string().max(48).optional(),
    billing_email: Joi.string().email().max(128).required(),
    contact_name: Joi.string().max(128).required(),
    phone_number: Joi.string().max(12).optional(),
    billing_address: Joi.string().max(256).required(),
    city: Joi.string().max(128).required(),
    state_province: Joi.string().max(128).optional(),
    country: Joi.string().max(128).required(),
    postcode: Joi.string().max(48).required()
})

const forgotPassword = Joi.object({
    email: Joi.string().email().max(128).required()
})

export default { create, login, changePassword, updateBillingInformation, forgotPassword }