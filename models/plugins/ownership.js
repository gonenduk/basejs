const ObjectId = require('mongodb').ObjectId;

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

module.exports = ModelClass => {
  return class extends ModelClass {
    addOne(item = {}) {
      item.ownerId = toObjectId(item.ownerId);
      return super.addOne(item);
    }

    getOneById(id, projection, filter = {}) {
      if (filter.ownerId) filter.ownerId = toObjectId(filter.ownerId);
      return super.getOneById(id, projection, filter)
    }

    updateOneById(id, item = {}, filter = {}) {
      if (filter.ownerId) filter.ownerId = toObjectId(filter.ownerId);
      return super.updateOneById(id, item, filter);
    }

    deleteOneById(id, filter = {}) {
      if (filter.ownerId) filter.ownerId = toObjectId(filter.ownerId);
      return super.deleteOneById(id, filter);
    }
  };
};
