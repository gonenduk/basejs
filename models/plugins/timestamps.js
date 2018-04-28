module.exports = ModelClass => {
  return class extends ModelClass {
    addOne(item = {}) {
      item.updatedAt = item.createdAt = new Date();
      return super.addOne(item);
    }

    updateMany(filter, item = {}) {
      // Check if timestamp should be updated
      if (item.updatedAt !== null)
        item.updatedAt = new Date();
      else
        delete item.updatedAt;
      return super.updateMany(filter, item);
    }

    updateOneById(id, item = {}, filter) {
      // Check if timestamp should be updated
      if (item.updatedAt !== null)
        item.updatedAt = new Date();
      else
        delete item.updatedAt;
      return super.updateOneById(id, item, filter);
    }
  };
};
