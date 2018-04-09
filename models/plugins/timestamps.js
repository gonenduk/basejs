module.exports = ModelClass => {
  return class extends ModelClass {
    addOne(item = {}) {
      item.updatedAt = item.createdAt = new Date();
      return super.addOne(item);
    }

    updateMany(item = {}) {
      item.updatedAt = new Date();
      return super.updateMany(item);
    }

    updateOneById(id, item = {}) {
      item.updatedAt = new Date();
      return super.updateOneById(id, item);
    }

    replaceOneById(id, item = {}) {
      item.updatedAt = item.createdAt = new Date();
      return super.replaceOneById(id, item);
    }
  };
};
