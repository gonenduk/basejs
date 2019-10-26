const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

const router = express.Router();
const basePath = '/profiles';

router.get(`${basePath}/:id`, (req, res, next) => {
  const { user } = req;
  const permission = (user.id === req.params.id)
    ? ac.can(user.role).readOwn('profile')
    : ac.can(user.role).readAny('profile');
  if (!permission.granted) throw Boom.forbidden('Access denied');

  next();
});

module.exports = router;
