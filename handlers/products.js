const Product = require('../models/product');
const resourceCollectionMixin = require('./mixin/resource-collection');

module.exports = resourceCollectionMixin(Product);
