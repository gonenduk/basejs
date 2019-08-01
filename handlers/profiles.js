const express = require('express');
const Boom = require('@hapi/boom');
const model = require('../models/user');
const ac = require('../lib/acl');
const itemHandler = require('./routers/item-handler');

const router = express.Router();
const basePath = '/profiles';

router.get(`${basePath}/:id`, (req, res, next) => {
  if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

  // Access control
  const permission = (req.user.id === req.pathParams.id)
    ? ac.can(req.user.role).readOwn('profile')
    : ac.can(req.user.role).readAny('profile');
  if (!permission.granted) throw Boom.forbidden('Access denied');

  // Get profile fields only
  req.query.projection = { username: 1 };

  next();
});

router.use(basePath, itemHandler(model));

module.exports = router;
