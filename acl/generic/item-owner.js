const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

const router = express.Router();

router.route('/:id/owner')
  .put((req, res, next) => {
    const { user } = req;
    let permission = ac.can(user.role).updateAny('resource-owner');
    if (!permission.granted) {
      permission = ac.can(user.role).updateOwn('resource-owner');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: user.id };
    }

    next();
  });

module.exports = router;
