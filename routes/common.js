const express = require('express');
const jwtExtraction = require('express-jwt');
const jwt = require('../lib/jwt');

const router = express.Router();

// Define access control
require('./acl');

// Default JWT extraction options
const jwtOptions = { secret: jwt.secret, credentialsRequired: false };

// JWT extraction
router.use('/', jwtExtraction(jwtOptions), (req, res, next) => {
  // Create a default guest user if token not given
  if (!req.user) req.user = { role: 'guest' };
  next();
});

module.exports = router;
