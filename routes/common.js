const express = require('express');
const jwtExtraction = require('express-jwt');
const jwt = require('../lib/jwt');
const ac = require('../lib/acl');
const router = express.Router();

// Default JWT extraction options
const jwtOptions = { secret: jwt.options.secret, credentialsRequired: false };

// JWT extraction
router.use('/', jwtExtraction(jwtOptions), (req, res, next) => {
  // Create a default guest user if token not given
  if (!req.user) req.user = { role: 'guest' };
  next();
});

// Access control
ac.grant('guest')
    .createOwn('user', ['*', '!role']).readAny('resource')
  .grant('user').extend('guest')
    .readOwn('user').updateOwn('user', ['*', '!role']).createOwn('resource').updateOwn('resource').deleteOwn('resource')
  .grant('moderator').extend('user')
    .readAny('user')
  .grant('admin').extend('moderator')
  .createOwn('user').readAny('user').updateAny('user').updateAny('resource').deleteAny('resource');

module.exports = router;
