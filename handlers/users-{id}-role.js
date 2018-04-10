const user = require('../models/user');
const roles = require('../lib/roles');
const ResourceItem = require('./plugins/resource-item');
const Boom = require('boom');

class UserHandler extends ResourceItem {
  constructor() {
    super(user);
  }

  async put(req, res, next) {
    if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

    // Cannot update role to sysadmin
    if (roles.isSysAdmin(req.body.role))
      return next(Boom.forbidden('Cannot update role to SysAdmin'));

    // Verify user being updated is not sysadmin
    req.body.projection = { role: 1 };
    const updatedUser = await this.model.getOneById(req.pathParams.id, { role: 1 });
    if (!updatedUser)
      return next(Boom.notFound(`${req.originalUrl} not found`));
    if (roles.isSysAdmin(updatedUser.role))
      return next(Boom.forbidden('Cannot update role of SysAdmin'));

    return super.patch(req, res, next);
  }
}

module.exports = new UserHandler();
