const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    // Access control
    const permission = ac.can(req.user.role).readAny('resource');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  })

  .post((req, res, next) => {
    // Set ownership to current user
    req.body.ownerId = req.user.id;

    // Access control
    const permission = ac.can(req.user.role).createOwn('resource');
    if (!permission.granted) throw Boom.forbidden('Not allowed to create item');

    next();
  });

module.exports = router;
