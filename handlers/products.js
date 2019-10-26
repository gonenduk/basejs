const express = require('express');
const model = require('../models/product');
const collectionACL = require('./generic/collection-acl');
const collectionHandler = require('./generic/collection-handler');
const itemACL = require('./generic/item-acl');
const itemHandler = require('./generic/item-handler');
const itemOwnerACL = require('./generic/item-owner-acl');
const itemOwnerHandler = require('./generic/item-owner-handler');

const router = express.Router();
const basePath = '/products';

router
  .use(basePath, collectionACL, collectionHandler(model))
  .use(basePath, itemACL, itemHandler(model))
  .use(basePath, itemOwnerACL, itemOwnerHandler);

module.exports = router;
