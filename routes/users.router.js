const express = require('express');
const passport = require('passport');

const UserService = require('../services/users.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createSchema, updateSchema, getSchema } = require('./../schemas/user.schema');

const router = express.Router();
const service = new UserService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cashier'),
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cashier'),
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = await service.create(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cashier'),
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await service.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cashier'),
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
