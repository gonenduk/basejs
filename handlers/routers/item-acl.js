const express = require('express');
const Boom = require('boom');
const ac = require('../../lib/acl');

const router = express.Router();

router.route('/:id')
  .get((req, res, next) => {
    // Access control
    let permission = ac.can(req.user.role).readAny('resource');
    if (!permission.granted) {
      permission = ac.can(req.user.role).readOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  })

  .patch((req, res, next) => {
    // Access control
    let permission = ac.can(req.user.role).updateAny('resource');
    if (!permission.granted) {
      permission = ac.can(req.user.role).updateOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  })

  .delete((req, res, next) => {
    // Access control
    let permission = ac.can(req.user.role).deleteAny('resource');
    if (!permission.granted) {
      permission = ac.can(req.user.role).deleteOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  });

module.exports = router;