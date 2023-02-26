
const Joi = require('joi');

const email = Joi.string().email();
const password = Joi.string().min(8);
const token = Joi.string().min(8);
const newPassword = Joi.string().min(8);

const authSchema = Joi.object({
  email: email.required(),
  password: password.required()
});

const recoverySchema = Joi.object({
  email: email.required()
});

const changePasswordSchema = Joi.object({
  newPassword: newPassword.required(),
  token: token.required()
});

module.exports = { authSchema, recoverySchema, changePasswordSchema }
