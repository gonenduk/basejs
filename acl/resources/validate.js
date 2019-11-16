const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

module.exports = {
  byUserId: (user, action, resource, id) => {
    const actionType = user.id === id ? `${action}Own` : `${action}Any`;
    const permission = ac.can(user.role)[actionType](resource);
    if (!permission.granted) throw Boom.forbidden();
  },

  anyByOwnerId: (user, action, resource) => {
    const actionAny = `${action}Any`;
    const permission = ac.can(user.role)[actionAny](resource);
    if (!permission.granted) throw Boom.forbidden();
  },

  oneByOwnerId: (user, action, resource, query = {}) => {
    const actionAny = `${action}Any`;
    let permission = ac.can(user.role)[actionAny](resource);
    if (!permission.granted) {
      const actionOwn = `${action}Own`;
      permission = ac.can(user.role)[actionOwn](resource);
      if (!permission.granted) throw Boom.forbidden();
      // eslint-disable-next-line no-param-reassign
      query.filter = { ownerId: user.id };
    }
  },
};
