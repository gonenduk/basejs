const express = require('express');
const Boom = require('@hapi/boom');
const model = require('../models/user');
const ac = require('../lib/acl');
const collectionHandler = require('./routers/collection-handler');
const itemHandler = require('./routers/item-handler');
const safe = require('./routers/safe');

const router = express.Router();
const basePath = '/users';

router.route(basePath)
  .get((req, res, next) => {
    // Access control
    const permission = ac.can(req.user.role).readAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    // Hide password (write only)
    req.query.projection = { password: 0 };

    next();
  })

  .post((req, res, next) => {
    // Access control
    const permission = ac.can(req.user.role).createOwn('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    // New user role is always set to user
    req.body.role = 'user';

    next();
  });

router.route(`${basePath}/:id`)
  .get((req, res, next) => {
    // Access control
    const permission = (req.user.id === req.params.id)
      ? ac.can(req.user.role).readOwn('user')
      : ac.can(req.user.role).readAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    // Hide password (write only)
    req.query.projection = { password: 0 };

    next();
  })

  .patch((req, res, next) => {
    // Access control
    const permission = (req.user.id === req.params.id)
      ? ac.can(req.user.role).updateOwn('user')
      : ac.can(req.user.role).updateAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  });

router.route(`${basePath}/:id/role`)
  .put(safe(async (req, res) => {
    // Access control
    const permission = (req.user.id === req.params.id)
      ? ac.can(req.user.role).updateOwn('user-role')
      : ac.can(req.user.role).updateAny('user-role');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    // Update item owner
    const item = await model.setRole(req.params.id, req.body);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.status(204).end();
  }));

router
  .use(basePath, collectionHandler(model))
  .use(basePath, itemHandler(model));

module.exports = router;
