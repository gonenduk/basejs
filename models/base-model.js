/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */
const mongo = require('../lib/mongodb');

const { ObjectId } = mongo.driver;

class BaseModel {
  constructor(collectionName, options = {}) {
    if (mongo.isConnected) {
      this.collection = mongo.db.collection(collectionName);
      this.ownership = options.ownership;
      this.timestamps = options.timestamps;
    } else {
      this.connection = () => { throw Error('Not connected'); };
    }
  }

  static toObjectId(id) {
    // Invalid id should rethrow with status 400
    try {
      return new ObjectId(id);
    } catch (err) {
      err.message = `id: ${err.message}`;
      err.status = 400;
      throw err;
    }
  }

  // ***** Timestamps
  addTimestamp(item = {}) {
    if (this.timestamps) {
      item.createdAt = new Date();
      item.updatedAt = item.createdAt;
    }
  }

  updateTimestamp(item = {}) {
    if (this.timestamps) {
      // Check if timestamp should be updated
      if (item.updatedAt !== null) {
        item.updatedAt = new Date();
      } else {
        delete item.updatedAt;
      }
    }
  }

  // ***** Ownership
  convertOwnerId(item = {}) {
    if (this.ownership && item.ownerId) {
      item.ownerId = BaseModel.toObjectId(item.ownerId);
    }
  }

  // ***** Collections
  async addOne(item = {}) {
    this.addTimestamp(item);
    this.convertOwnerId(item);
    await this.collection.insertOne(item);
    return item;
  }

  getMany(filter = {}, options = {}) {
    this.convertOwnerId(filter);
    return this.collection.find(filter, options).toArray();
  }

  updateMany(filter = {}, item = {}, unsetItem = []) {
    this.updateTimestamp(item);
    this.convertOwnerId(filter);
    return this.collection.updateMany(filter, [{ $set: item }, { $unset: unsetItem }]);
  }

  deleteMany(filter = {}) {
    this.convertOwnerId(filter);
    return this.collection.deleteMany(filter);
  }

  // ***** Documents
  getOneByFilter(filter = {}, options = {}) {
    this.convertOwnerId(filter);
    return this.collection.findOne(filter, options);
  }

  getOneById(id, filter = {}, options = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    return this.collection.findOne(query, options);
  }

  async updateOneById(id, filter = {}, item = {}, unsetItem = []) {
    const objectId = BaseModel.toObjectId(id);
    this.updateTimestamp(item);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    const result = await this.collection.updateOne(query, [{ $set: item }, { $unset: unsetItem }]);
    return result.modifiedCount === 1;
  }

  async deleteOneById(id, filter = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    const result = await this.collection.deleteOne(query);
    return result.deletedCount === 1;
  }

  replaceOwnerById(id, filter, ownerId) {
    const item = { ownerId: BaseModel.toObjectId(ownerId) };
    return this.updateOneById(id, filter, item);
  }
}

module.exports = BaseModel;
