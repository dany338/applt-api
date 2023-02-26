const express = require('express');

const usersRouter = require('./users.router');
const companyRouter = require('./company.router');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/companies', companyRouter);
  router.use('/profile', profileRouter);
  router.use('/auth', authRouter);
}

module.exports = routerApi;
