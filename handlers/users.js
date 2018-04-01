const User = require('../models/user');
const resourceCollectionMixin = require('./mixin/resource-collection');

module.exports = resourceCollectionMixin(User);