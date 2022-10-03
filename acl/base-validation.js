/* eslint-disable no-underscore-dangle,no-param-reassign */
const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

function safeParse(str) {
  if (!str) return {};
  let obj;
  try {
    obj = JSON.parse(str);
  } catch (err) {
    throw Boom.badRequest(`failed to parse filter: ${err.message}`);
  }
  if (typeof obj !== 'object') throw Boom.badRequest('filter is not an object');
  return obj;
}

// Validations according to user id field in collection
module.exports = {
  _id(user, action, resource, userId) {
    // Validate user role can access any item
    let actionType = `${action}Any`;
    let permission = ac.can(user.role)[actionType](resource);
    if (!permission.granted) {
      // Validate user can access own item
      actionType = `${action}Own`;
      permission = ac.can(user.role)[actionType](resource);
      if (!permission.granted) throw Boom.forbidden();
      // Validate user is accessing own item
      if (user.id !== userId) throw Boom.forbidden();
    }
  },

  ownerId(user, action, resource, query) {
    // Validate user role can access any item
    let actionType = `${action}Any`;
    let permission = ac.can(user.role)[actionType](resource);
    if (!permission.granted) {
      // Validate user can access own item
      actionType = `${action}Own`;
      permission = ac.can(user.role)[actionType](resource);
      if (!permission.granted) throw Boom.forbidden();
      // Validate user not trying to access not own items
      const filter = safeParse(query.filter);
      if (filter.ownerId && filter.ownerId !== user.id) throw Boom.forbidden();
      // Filter own items
      filter.ownerId = user.id;
      query.filter = JSON.stringify(filter);
    }
  },
};
