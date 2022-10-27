/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */
const { MongoError } = require('mongodb');
const Boom = require('@hapi/boom');
const mongo = require('../lib/mongodb');

const { ObjectId } = mongo.driver;

function convertError(err) {
  if (err instanceof MongoError && err.code === 11000) {
    const keys = Object.keys(err.keyValue).toString();
    throw Boom.conflict(`Already in use: ${keys}`);
  }
  throw err;
}

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
      throw Boom.badRequest(`id: ${err.message}`);
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
    await this.collection.insertOne(item).catch(convertError);
    return item;
  }

  getMany(filter = {}, options = {}) {
    this.convertOwnerId(filter);
    return this.collection.find(filter, options).toArray();
  }

  updateMany(filter = {}, item = {}, extra = {}) {
    this.updateTimestamp(item);
    this.convertOwnerId(filter);
    const pipeline = { $set: item, ...extra };
    return this.collection.updateMany(filter, pipeline).catch(convertError);
  }

  deleteMany(filter = {}) {
    this.convertOwnerId(filter);
    return this.collection.deleteMany(filter);
  }

  // ***** Documents
  isExists(filter = {}) {
    this.convertOwnerId(filter);
    return this.collection.countDocuments(filter, { limit: 1 });
  }

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

  async updateOneById(id, filter = {}, item = {}, extra = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.updateTimestamp(item);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    const pipeline = { $set: item, ...extra };
    const result = await this.collection.updateOne(query, pipeline).catch(convertError);
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
