const Joi = require('joi');

const id = Joi.number().integer();
const clientId = Joi.number().integer();
const date = Joi.date();
const description = Joi.string().min(3).max(30);
const amount = Joi.number().integer();
const limit = Joi.number().integer();
const offset = Joi.number().integer();

const linesSchema = Joi.array().items(
  Joi.object({
    id,
    description: description.required(),
    amount: amount.required(),
  })
);

const createSchema = Joi.object({
  clientId,
  date,
  lines: linesSchema.required(),
});

const updateSchema = Joi.object({
  clientId,
  date,
  lines: linesSchema,
});

const getSchema = Joi.object({
  id: id.required(),
});

const querySchema = Joi.object({
  limit,
  offset,
  date,
  clientId: clientId.when('date', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
});

module.exports = { createSchema, updateSchema, getSchema, querySchema }
