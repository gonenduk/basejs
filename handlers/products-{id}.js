const Product = require('../models/product');
const crudItemMixin = require('./mixin/crud-item');

module.exports = crudItemMixin(Product);
