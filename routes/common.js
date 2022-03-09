const express = require('express');
const requestIp = require('request-ip');
const jwtExtraction = require('express-jwt');
const jwt = require('../lib/jwt');

const router = express.Router();

// Default JWT extraction options
const jwtOptions = { secret: jwt.secret, credentialsRequired: false, algorithms: ['HS256'] };

// Client IP
router.use(requestIp.mw());

// JWT extraction
router.use(jwtExtraction(jwtOptions), (req, res, next) => {
  // Create a default guest user if token not given
  if (!req.user) req.user = { role: 'guest' };
  next();
});

module.exports = router;
