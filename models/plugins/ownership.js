const ObjectId = require('mongodb').ObjectId;

module.exports = ModelClass => {
  return class extends ModelClass {
    addOne(item = {}) {
      item.ownerId = new ObjectId(item.ownerId);
      return super.addOne(item);
    }
  };
};
