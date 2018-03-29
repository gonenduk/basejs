const User = require('../models/user');
const crudItemMixin = require('./mixin/crud-item');

module.exports = crudItemMixin(User);
