import Joi from 'joi'

const create = Joi.object({
    email: Joi.string().email().max(128).required(),
    password: Joi.string().max(24).required(),
    company_name: Joi.string().max(128).required(),
    contact_person: Joi.string().max(128).required(),
    phone_number: Joi.string().max(12).required
})

export default { create }