const User = require('../models/user');
const crudCollectionMixin = require('./mixin/crud-collection');

module.exports = crudCollectionMixin(User);