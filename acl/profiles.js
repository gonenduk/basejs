const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

const router = express.Router();
const basePath = '/profiles';

router.get(`${basePath}/:id`, (req, res, next) => {
  const permission = (req.user.id === req.params.id)
    ? ac.can(req.user.role).readOwn('profile')
    : ac.can(req.user.role).readAny('profile');
  if (!permission.granted) throw Boom.forbidden('Access denied');

  next();
});

module.exports = router;
