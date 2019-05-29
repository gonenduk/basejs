const express = require('express');
const model = require('../models/product');
const collectionACL = require('./routers/collection-acl');
const collectionHandler = require('./routers/collection-handler');
const itemACL = require('./routers/item-acl');
const itemHandler = require('./routers/item-handler');
const itemOwnerACL = require('./routers/item-owner-acl');
const itemOwnerHandler = require('./routers/item-owner-handler');

const router = express.Router();
const basePath = '/products';

router
  .use(basePath, collectionACL)
  .use(basePath, collectionHandler(model))
  .use(basePath, itemACL)
  .use(basePath, itemHandler(model))
  .use(basePath, itemOwnerACL)
  .use(basePath, itemOwnerHandler);

module.exports = router;
