const collectionACL = require('./collection');
const itemACL = require('./item');
const itemOwnerACL = require('./item-owner');

module.exports = {
  ...collectionACL,
  id: {
    ...itemACL,
    owner: {
      ...itemOwnerACL,
    },
  },
};
