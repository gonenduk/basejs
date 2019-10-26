const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

const router = express.Router();
const basePath = '/users';

router.route(basePath)
  .get((req, res, next) => {
    const { user } = req;
    const permission = ac.can(user.role).readAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  })

  .post((req, res, next) => {
    const { user } = req;
    const permission = ac.can(user.role).createOwn('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  });

router.route(`${basePath}/:id`)
  .get((req, res, next) => {
    const { user } = req;
    const permission = (user.id === req.params.id)
      ? ac.can(user.role).readOwn('user')
      : ac.can(user.role).readAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  })

  .patch((req, res, next) => {
    const { user } = req;
    const permission = (user.id === req.params.id)
      ? ac.can(user.role).updateOwn('user')
      : ac.can(user.role).updateAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  });

router.route(`${basePath}/:id/role`)
  .put(async (req, res, next) => {
    const { user } = req;
    const permission = (user.id === req.params.id)
      ? ac.can(user.role).updateOwn('user-role')
      : ac.can(user.role).updateAny('user-role');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  });

module.exports = router;
