/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */

module.exports = (ModelClass) => class extends ModelClass {
  addOne(item = {}) {
    item.createdAt = new Date();
    item.updatedAt = item.createdAt;
    return super.addOne(item);
  }

  updateMany(filter, item = {}) {
    // Check if timestamp should be updated
    if (item.updatedAt !== null) {
      item.updatedAt = new Date();
    } else {
      delete item.updatedAt;
    }
    return super.updateMany(filter, item);
  }

  updateOneById(id, item = {}, filter) {
    // Check if timestamp should be updated
    if (item.updatedAt !== null) {
      item.updatedAt = new Date();
    } else {
      delete item.updatedAt;
    }
    return super.updateOneById(id, item, filter);
  }
};
