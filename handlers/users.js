const User = require('../models/user');
const ResourceCollection = require('./plugins/resource-collection');

class UsersHandler extends ResourceCollection {
  constructor() {
    super(User);
  }
}

module.exports = new UsersHandler();