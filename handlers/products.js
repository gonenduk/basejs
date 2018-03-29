const Product = require('../models/product');
const crudCollectionMixin = require('./mixin/crud-collection');

module.exports = crudCollectionMixin(Product);
