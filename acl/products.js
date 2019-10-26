const express = require('express');
const collectionACL = require('./generic/collection');
const itemACL = require('./generic/item');
const itemOwnerACL = require('./generic/item-owner');

const router = express.Router();
const basePath = '/products';

router
  .use(basePath, collectionACL)
  .use(basePath, itemACL)
  .use(basePath, itemOwnerACL);

module.exports = router;
