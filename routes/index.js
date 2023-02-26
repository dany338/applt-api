const express = require('express');

const usersRouter = require('./users.router');
const clientsRouter = require('./clients.router');
const invoicesRouter = require('./invoices.router');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/clients', clientsRouter);
  router.use('/invoices', invoicesRouter);
  router.use('/profile', profileRouter);
  router.use('/auth', authRouter);
}

module.exports = routerApi;
