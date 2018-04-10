const ObjectId = require('mongodb').ObjectId;

module.exports = ModelClass => {
  return class extends ModelClass {
    addOne(item = {}) {
      // Default owner is current user
      if (!item.ownerId) item.ownerId = new ObjectId(item.ownerId);
      return super.addOne(item);
    }
  };
};
