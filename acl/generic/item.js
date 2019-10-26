const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

const router = express.Router();

router.route('/:id')
  .get((req, res, next) => {
    const { user } = req;
    let permission = ac.can(user.role).readAny('resource');
    if (!permission.granted) {
      permission = ac.can(user.role).readOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: user.id };
    }

    next();
  })

  .patch((req, res, next) => {
    const { user } = req;
    let permission = ac.can(user.role).updateAny('resource');
    if (!permission.granted) {
      permission = ac.can(user.role).updateOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: user.id };
    }

    next();
  })

  .delete((req, res, next) => {
    const { user } = req;
    let permission = ac.can(user.role).deleteAny('resource');
    if (!permission.granted) {
      permission = ac.can(user.role).deleteOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: user.id };
    }

    next();
  });

module.exports = router;
