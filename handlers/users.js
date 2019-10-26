const express = require('express');
const Boom = require('@hapi/boom');
const model = require('../models/user');
const collectionHandler = require('./generic/collection');
const itemHandler = require('./generic/item');
const safe = require('./generic/safe');

const router = express.Router();
const basePath = '/users';

router.route(basePath)
  .get((req, res, next) => {
    // Hide password (write only)
    req.query.projection = { password: 0 };

    next();
  })

  .post((req, res, next) => {
    // New user role is always set to user
    req.body.role = 'user';

    next();
  });

router.route(`${basePath}/:id`)
  .get((req, res, next) => {
    // Hide password (write only)
    req.query.projection = { password: 0 };

    next();
  });

router.route(`${basePath}/:id/role`)
  .put(safe(async (req, res) => {
    // Update item owner
    const item = await model.setRole(req.params.id, req.body);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.status(204).end();
  }));

router
  .use(basePath, collectionHandler(model))
  .use(basePath, itemHandler(model));

module.exports = router;
