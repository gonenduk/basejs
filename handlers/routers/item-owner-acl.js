const express = require('express');
const Boom = require('boom');
const ac = require('../../lib/acl');

const router = express.Router();

router.route('/:id/owner')
  .put((req, res, next) => {
    // Access control
    let permission = ac.can(req.user.role).updateAny('resource-owner');
    if (!permission.granted) {
      permission = ac.can(req.user.role).updateOwn('resource-owner');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  });

module.exports = router;
