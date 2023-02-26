const express = require('express');
const passport = require('passport');

const InvoiceService = require('../services/companies.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createSchema, updateSchema, getSchema, querySchema } = require('../schemas/company.schema');

const router = express.Router();
const service = new InvoiceService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cashier'),
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const invoices = await service.find(req.query);
      res.json(invoices);
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
      const invoice = await service.findOne(id);
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cashier'),
  validatorHandler(createSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const invoice = await service.create(body);
      res.status(201).json(invoice);
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
      const invoice = await service.update(id, body);
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
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
