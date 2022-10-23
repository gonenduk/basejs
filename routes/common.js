const express = require('express');
const requestIp = require('request-ip');
const { expressjwt } = require('express-jwt');
const Boom = require('@hapi/boom');
const jwt = require('../lib/jwt');

const router = express.Router();

// Default JWT extraction options
const jwtOptions = { secret: jwt.secret, credentialsRequired: false, algorithms: ['HS256'] };

// Client IP
router.use(requestIp.mw());

// JWT extraction
router.use(expressjwt(jwtOptions), (req, res, next) => {
  req.user = req.auth;
  // Create a default guest user if token not given
  if (!req.user) req.user = { role: 'guest' };
  // Verify role exists in user
  if (!req.user.role) throw Boom.badRequest('jwt missing role');
  next();
});

module.exports = router;
