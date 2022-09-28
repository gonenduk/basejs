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

  updateMany(filter = {}, item = {}) {
    this.updateTimestamp(item);
    return this.collection.updateMany(filter, { $set: item });
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

  getOneById(id, options = {}) {
    const objectId = BaseModel.toObjectId(id);
    return this.collection.findOne({ _id: objectId }, options);
  }

  async updateOneById(id, item = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.updateTimestamp(item);
    const result = await this.collection.updateOne({ _id: objectId }, { $set: item });
    return result.modifiedCount === 1;
  }

  async deleteOneById(id) {
    const objectId = BaseModel.toObjectId(id);
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }

  replaceOwnerById(id, ownerId) {
    const item = { ownerId: BaseModel.toObjectId(ownerId) };
    return this.updateOneById(id, item);
  }
}

module.exports = BaseModel;
