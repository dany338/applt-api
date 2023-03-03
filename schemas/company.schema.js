const Joi = require('joi');

const id = Joi.number().integer();
const userId = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const nit = Joi.string().min(3).max(30);
const address = Joi.string().min(3).max(30);
const phone = Joi.string().min(3).max(30);
const limit = Joi.number().integer();
const offset = Joi.number().integer();

const createSchema = Joi.object({
  userId: userId.required(),
  name: name.required(),
  nit: nit.required(),
  address: address.required(),
  phone: phone.required(),
});

const updateSchema = Joi.object({
  userId,
  name,
  nit,
  address,
  phone,
});

const getSchema = Joi.object({
  id: id.required(),
});

const querySchema = Joi.object({
  limit: limit.default(10).required(),
  offset: offset.default(0).required(),
  userId: userId.required(),
});

const exportedSendEmailSchema = Joi.object({
  userId: userId.required(),
});

module.exports = { createSchema, updateSchema, getSchema, querySchema, exportedSendEmailSchema }
