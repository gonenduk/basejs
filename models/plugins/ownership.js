/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item", "filter"] }] */
const mongo = require('../../lib/mongodb');

const { ObjectId } = mongo.driver;

function toObjectId(id) {
  // Invalid id should rethrow with status 400
  try {
    return new ObjectId(id);
  } catch (err) {
    err.message = `ownerId: ${err.message}`;
    err.status = 400;
    throw err;
  }
}

module.exports = (ModelClass) => class extends ModelClass {
  addOne(item = {}) {
    item.ownerId = toObjectId(item.ownerId);
    return super.addOne(item);
  }

  getOneById(id, projection, filter = {}) {
    if (filter.ownerId) filter.ownerId = toObjectId(filter.ownerId);
    return super.getOneById(id, projection, filter);
  }

  updateOneById(id, item = {}, filter = {}) {
    if (filter.ownerId) filter.ownerId = toObjectId(filter.ownerId);
    return super.updateOneById(id, item, filter);
  }

  deleteOneById(id, filter = {}) {
    if (filter.ownerId) filter.ownerId = toObjectId(filter.ownerId);
    return super.deleteOneById(id, filter);
  }

  replaceOwnerById(id, ownerId, filter = {}) {
    const item = { ownerId: toObjectId(ownerId) };
    return this.updateOneById(id, item, filter);
  }
};
