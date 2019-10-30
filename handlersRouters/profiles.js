const express = require('express');
const model = require('../models/user');
const itemHandler = require('./generic/item');

const router = express.Router();
const basePath = '/profiles';

router.get(`${basePath}/:id`, (req, res, next) => {
  // Get profile fields only
  req.query.projection = { username: 1 };

  next();
});

router.use(basePath, itemHandler(model));

module.exports = router;
