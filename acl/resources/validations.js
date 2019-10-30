const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

module.exports = (user, any, own, resource, info) => {
  let permission = any && ac.can(user.role)[any](resource);
  if (!permission || !permission.granted) {
    permission = own && ac.can(user.role)[own](resource);
    if (!permission || !permission.granted) throw Boom.forbidden();
    // eslint-disable-next-line no-param-reassign
    if (info.query) info.query.filter = { ownerId: user.id };
    if (info.id && user.id !== info.id) throw Boom.forbidden();
  }
};
