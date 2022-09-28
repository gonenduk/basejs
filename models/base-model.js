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
      item.updatedAt = item.createdAt;
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
    return this.collection.deleteMany(filter);
  }

  // ***** Documents
  getOne(filter = {}, options = {}) {
    this.convertOwnerId(filter);
    return this.collection.findOne(filter, options);
  }

  getOneById(id, projection = null, filter = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    return this.collection.findOne(query, { projection });
  }

  async updateOneById(id, item = {}, filter = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.updateTimestamp(item);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    const result = await this.collection.updateOne(query, { $set: item });
    return result.modifiedCount === 1;
  }

  async deleteOneById(id, filter = {}) {
    const objectId = BaseModel.toObjectId(id);
    this.convertOwnerId(filter);
    const query = { _id: objectId, ...filter };
    const result = await this.collection.deleteOne(query);
    return result.deletedCount === 1;
  }
}

module.exports = BaseModel;
