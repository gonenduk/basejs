const Boom = require('boom');

module.exports = ResourceClass => {
  return class extends ResourceClass {
  };
};
