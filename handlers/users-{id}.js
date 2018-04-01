const User = require('../models/user');
const resourceItemMixin = require('./mixin/resource-item');

module.exports = resourceItemMixin(User);
