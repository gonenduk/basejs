const express = require('express');
const { validate } = require('./validations');

const router = express.Router();

router.get('/profiles/:id', (req, res, next) => {
  validate.ownOrAnyByUserId(req.user, 'read', 'resource-public', req.params.id);
  next();
});

module.exports = router;
