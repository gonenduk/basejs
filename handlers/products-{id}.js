const Product = require('../models/product');
const resourceItemMixin = require('./mixin/resource-item');

module.exports = resourceItemMixin(Product);
