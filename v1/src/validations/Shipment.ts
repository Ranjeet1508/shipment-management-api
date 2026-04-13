import Joi from "joi";

const create = Joi.object({
  pickup_time: Joi.date().optional(),
  loading_time: Joi.string().max(5).optional(),
  carrier: Joi.string().required(), // ObjectId as string
  delivery_date_time: Joi.date().optional(),
  load_code: Joi.string().max(128).required(),
  destination: Joi.string().required(), // ObjectId
  references: Joi.array().items(Joi.string().max(1024)).optional(),
  pallets: Joi.number().optional(),
  cartons: Joi.number().optional(),
  kilo: Joi.number().optional(),
  arrival_time: Joi.string().max(5).optional(),
  departure_time: Joi.string().max(5).optional(),
  dock: Joi.string().required(), // ObjectId
  status: Joi.number().valid(0, 1, 2, 3).optional(),
  unloading_reference: Joi.string().max(512).optional(),
  comments: Joi.string().max(512).optional(),
  cmr_status: Joi.boolean().optional(),
  pod_status: Joi.boolean().optional(),
  sub_shipments: Joi.array().items(Joi.string()).optional(), // ObjectIds
  is_sub_shipment: Joi.boolean().optional(),
});

const update = Joi.object({
  _id: Joi.string().required(), // ObjectId
  pickup_time: Joi.date().optional(),
  loading_time: Joi.string().max(5).optional(),
  carrier: Joi.string().optional(),
  delivery_date_time: Joi.date().optional(),
  load_code: Joi.string().max(128).optional(),
  destination: Joi.string().optional(),
  references: Joi.array().items(Joi.string().max(1024)).optional(),
  pallets: Joi.number().optional(),
  cartons: Joi.number().optional(),
  kilo: Joi.number().optional(),
  arrival_time: Joi.string().max(5).optional(),
  departure_time: Joi.string().max(5).optional(),
  dock: Joi.string().optional(),
  status: Joi.number().valid(0, 1, 2, 3).optional(),
  unloading_reference: Joi.string().max(512).optional(),
  comments: Joi.string().max(512).optional(),
  cmr_status: Joi.boolean().optional(),
  pod_status: Joi.boolean().optional(),
  sub_shipments: Joi.array().items(Joi.string()).optional(),
  is_sub_shipment: Joi.boolean().optional(),
});

const addSubShipment = Joi.object({
  pickup_time: Joi.date().optional(),
  loading_time: Joi.string().max(5).optional(),
  carrier: Joi.string().required(),
  delivery_date_time: Joi.date().optional(),
  load_code: Joi.string().max(128).required(),
  destination: Joi.string().required(),
  references: Joi.array().items(Joi.string().max(1024)).optional(),
  pallets: Joi.number().optional(),
  cartons: Joi.number().optional(),
  kilo: Joi.number().optional(),
  arrival_time: Joi.string().max(5).optional(),
  departure_time: Joi.string().max(5).optional(),
  dock: Joi.string().required(),
  status: Joi.number().valid(0, 1, 2, 3).optional(),
  unloading_reference: Joi.string().max(512).optional(),
  comments: Joi.string().max(512).optional(),
  cmr_status: Joi.boolean().optional(),
  pod_status: Joi.boolean().optional(),
  sub_shipments: Joi.array().items(Joi.string()).optional(),
  is_sub_shipment: Joi.boolean().optional(),
});

const updatedSubShipment = Joi.object({
  references: Joi.array().items(Joi.string().max(1024)).optional(),
  pallets: Joi.number().optional(),
  cartons: Joi.number().optional(),
  kilo: Joi.number().optional(),
  comments: Joi.string().max(512).optional(),
});

export default { create, update, addSubShipment, updatedSubShipment };
