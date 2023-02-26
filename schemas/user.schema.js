const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(4);
const code = Joi.string().min(4);
const firstName = Joi.string().min(3);
const lastName = Joi.string().min(3);

const cashierSchema = Joi.object({
  code: code.required(),
  firstName: firstName.required(),
  lastName: lastName.required()
});

const createSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role.required(),
  cashier: cashierSchema.required(),
});

const updateSchema = Joi.object({
  email: email,
  role: role,
  cashier: cashierSchema,
});

const getSchema = Joi.object({
  id: id.required(),
});

module.exports = { createSchema, updateSchema, getSchema }
