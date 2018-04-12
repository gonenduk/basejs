const logger = require('../../lib/logger');
const connection = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

function toObjectId(id) {
  // Invalid id should rethrow with status 400
  try {
    return new ObjectId(id);
  } catch (err) {
    err.message = `id: ${err.message}`;
    err.status = 400;
    throw err;
  }
}

class MongoModel {
  constructor (collectionName) {
    this.collectionName = collectionName;
    connection.then(db => {
      if (db)
        db.collection(collectionName, { strict: true }, (err, collection) => {
          this.collection = collection;
          if (err) logger.warn(`Cannot access '${collectionName}' collection: ${err.message}`);
        });
      else
        logger.warn(`Cannot access '${collectionName}' collection. DB not connected`);
    });
  }

  // ***** Collections
  async addOne(item = {}) {
    await this.collection.insertOne(item);
    return item;
  }

  getMany(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  updateMany(filter = {}, item = {}) {
    return this.collection.updateMany(filter, { $set: item });
  }

  deleteMany(filter = {}) {
    return this.collection.deleteMany(filter);
  }

  // ***** Documents
  isExist(filter = {}) {
    return this.collection.find(filter, { limit: 1 }).count({ limit: true });
  }

  getOne(filter = {}, options = {}) {
    return this.collection.findOne(filter, options);
  }

  getOneById(id, projection = null, filter = {}) {
    const objectId = toObjectId(id);
    const query = Object.assign({ _id: objectId }, filter);
    return this.collection.findOne(query, { projection });
  }

  async updateOneById(id, item = {}, filter = {}) {
    const objectId = toObjectId(id);
    const query = Object.assign({ _id: objectId }, filter);
    const result = await this.collection.updateOne(query, { $set: item });
    return result.modifiedCount === 1;
  };

  async deleteOneById(id, filter = {}) {
    const objectId = toObjectId(id);
    const query = Object.assign({ _id: objectId }, filter);
    const result = await this.collection.deleteOne(query);
    return result.deletedCount === 1;
  }
}

module.exports = MongoModel;
