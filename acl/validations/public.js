const express = require('express');
const validate = require('./validate');

const router = express.Router();

router.get('/', (req, res, next) => {
  validate.anyByUserRole(req.user, 'read', 'resource-public');
  next();
});

router.post('/', (req, res, next) => {
  validate.anyByUserRoleOrOwnByOwnerId(req.user, 'create', 'resource');
  next();
});

router.get('/:id', (req, res, next) => {
  validate.anyByUserRoleOrOwnByOwnerId(req.user, 'read', 'resource-public', req.query);
  next();
});

router.patch('/:id', (req, res, next) => {
  validate.anyByUserRoleOrOwnByOwnerId(req.user, 'update', 'resource', req.query);
  next();
});

router.delete('/:id', (req, res, next) => {
  validate.anyByUserRoleOrOwnByOwnerId(req.user, 'delete', 'resource', req.query);
  next();
});

router.put('/:id/owner', (req, res, next) => {
  validate.anyByUserRole(req.user, 'update', 'resource-system');
  next();
});

module.exports = router;
