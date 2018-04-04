const logger = require('../lib/logger');
const connection = require('../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

function toObjectId(id) {
  // Invalid id should return null
  try {
    return new ObjectId(id);
  } catch (err) {
    return null;
  }
}

class MongoModel {
  constructor (collectionName, schema = {}) {
    this.collectionName = collectionName;
    this.schema = schema;
    connection.then(db => {
      if (db)
        return this.init(db);
      else
        logger.warn(`Cannot initiate '${collectionName}' collection. DB not connected`);
    });
  }

  async init(db) {
    // Add timestamp to schema
    if (this.schema.$jsonSchema && this.schema.$jsonSchema.properties) {
      this.schema.$jsonSchema.properties.createdAt = { bsonType: "date" };
      this.schema.$jsonSchema.properties.updatedAt = { bsonType: "date" };
    }

    // Create collection and update latest schema
    try {
      this.collection = await db.createCollection(this.collectionName);
      await db.command({ collMod: this.collectionName, validator: this.schema });
      logger.debug(`Successfully created '${this.collectionName}' collection and schema`);
    } catch (err) {
      logger.error(`Failed to create '${this.collectionName}' collection and schema: ${err.message}`);
    }
  }

  // ***** Collections
  async addOne(item = {}) {
    await this.collection.insertOne(item);
    return item;
  }

  getMany(filter = {}, sort = null, skip = 0, limit = 20, projection = null) {
    return this.collection.find(filter, { sort, skip, limit, projection }).toArray();
  }

  updateMany(filter = {}, item = {}) {
    return this.collection.updateMany(filter, { $set: item });
  };

  deleteMany(filter = {}) {
    return this.collection.deleteMany(filter);
  };

  // ***** Documents
  getOneById(id, projection = null) {
    const objectId = toObjectId(id);
    if (!objectId) return null;
    return this.collection.findOne({ _id: objectId }, { projection });
  }

  async updateOneById(id, item = {}) {
    const objectId = toObjectId(id);
    if (!objectId) return null;
    const result = await this.collection.updateOne({ _id: objectId }, { $set: item });
    return result.modifiedCount === 1;
  };

  async replaceOneById(id, item = {}) {
    const objectId = toObjectId(id);
    if (!objectId) return null;
    const result = await this.collection.replaceOne({ _id: objectId }, item);
    return result.modifiedCount === 1;
  };

  async deleteOneById(id) {
    const objectId = toObjectId(id);
    if (!objectId) return null;
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }
}

module.exports = MongoModel;
