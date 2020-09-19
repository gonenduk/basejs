const express = require('express');
const { validate } = require('./validations');

const router = express.Router();

router.get('/users', (req, res, next) => {
  validate.ownOrAnyByUserId(req.user, 'read', 'resource');
  next();
});

router.post('/users', (req, res, next) => {
  next();
});

router.get('/users/:id', (req, res, next) => {
  validate.ownOrAnyByUserId(req.user, 'read', 'resource', req.params.id);
  next();
});

router.patch('/users/:id', (req, res, next) => {
  validate.ownOrAnyByUserId(req.user, 'update', 'resource', req.params.id);
  next();
});

router.put('/users/:id/role', (req, res, next) => {
  validate.anyByUserRole(req.user, 'update', 'resource-system');
  next();
});

module.exports = router;
