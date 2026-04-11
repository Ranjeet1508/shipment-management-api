import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().max(128).required(),
    contact_person: Joi.string().max(48).optional().allow(''),
    contact_email: Joi.string().email().max(128).optional().allow(''),
    address_1: Joi.string().max(128).optional().allow(''),
    address_2: Joi.string().max(128).optional().allow(''),
    address_3: Joi.string().max(128).optional().allow(''),
    country: Joi.string().max(128).optional().allow(''),
    comment: Joi.string().max(512).optional().allow(''),
    status: Joi.boolean().optional().default(true),
    deleted: Joi.boolean().optional().default(false)
})


const update = Joi.object({
    _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    name: Joi.string().max(128).required(),
    contact_person: Joi.string().max(48).optional().allow(''),
    contact_email: Joi.string().email().max(128).optional().allow(''),
    address_1: Joi.string().max(128).optional().allow(''),
    address_2: Joi.string().max(128).optional().allow(''),
    address_3: Joi.string().max(128).optional().allow(''),
    country: Joi.string().max(128).optional().allow(''),
    comment: Joi.string().max(512).optional().allow(''),
    status: Joi.boolean().optional(),
})

export default {
    create,
    update
}