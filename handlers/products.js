const express = require('express');
const model = require('../models/product');
const collectionHandler = require('./generic/collection');
const itemHandler = require('./generic/item');
const itemOwnerHandler = require('./generic/item-owner');

const router = express.Router();
const basePath = '/products';

router
  .use(basePath, collectionHandler(model))
  .use(basePath, itemHandler(model))
  .use(basePath, itemOwnerHandler);

module.exports = router;
