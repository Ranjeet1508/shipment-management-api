import Joi from "joi";

const create = Joi.object({
  name: Joi.string().max(128).required(),
  purpose: Joi.string().max(128).optional().allow(""),
  comment: Joi.string().max(512).optional().allow(""),
  availability: Joi.boolean().optional().default(true),
  status: Joi.boolean().optional().default(true),
  deleted: Joi.boolean().optional().default(false),
});

const update = Joi.object({
  _id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: Joi.string().max(128).required(),
  purpose: Joi.string().max(128).optional().allow(""),
  comment: Joi.string().max(512).optional().allow(""),
  availability: Joi.boolean().optional(),
  status: Joi.boolean().optional(),
});

export default {
  create,
  update,
};
