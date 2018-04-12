module.exports = ModelClass => {
  return class extends ModelClass {
    addOne(item = {}) {
      item.updatedAt = item.createdAt = new Date();
      return super.addOne(item);
    }

    updateMany(filter, item = {}) {
      item.updatedAt = new Date();
      return super.updateMany(filter, item);
    }

    updateOneById(id, item = {}, filter) {
      item.updatedAt = new Date();
      return super.updateOneById(id, item, filter);
    }
  };
};
