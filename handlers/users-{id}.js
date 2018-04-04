const User = require('../models/user');
const ResourceItem = require('./plugins/resource-item');

class UserHandler extends ResourceItem {
  constructor() {
    super(User);
  }
}

module.exports = new UserHandler();
