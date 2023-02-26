const boom = require('@hapi/boom');
const { config } = require('../config/config');

function checkApiKey(req, res, next) {
  const apikey = req.headers['api'];
  if (apikey === config.apikey) {
    next();
  } else {
    next(boom.unauthorized('apikey is required'));
  }
}

function checkAdminRole(req, res, next) {
  const user = req.user;
  if (user.role === 'admin') {
    next();
  } else {
    next(boom.unauthorized('You are not authorized'));
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(boom.unauthorized('You are not authorized'));
    }
    next();
  }
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
