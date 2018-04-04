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
  constructor (collectionName, schema) {
    connection.then(db => {
      if (db)
        return this.init(db, collectionName, schema);
      else
        logger.warn(`Cannot initiate '${collectionName}' collection. DB not connected`);
    });
  }

  async init(db, collectionName, schema = {}) {
    // Add timestamp to schema
    if (schema.$jsonSchema && schema.$jsonSchema.properties) {
      schema.$jsonSchema.properties.createdAt = { bsonType: "date" };
      schema.$jsonSchema.properties.updatedAt = { bsonType: "date" };
    }

    // Create collection and update latest schema
    try {
      this.collection = await db.createCollection(collectionName);
      await db.command({ collMod: collectionName, validator: schema });
      logger.debug(`Successfully created '${collectionName}' collection and schema`);
    } catch (err) {
      logger.error(`Failed to create '${collectionName}' collection and schema: ${err.message}`);
    }
  }

  getAll(filter = null, sort = null, skip = 0, limit = 20, projection = null) {
    return this.collection.find(filter, { sort, skip, limit, projection }).toArray();
  }

  getOneById(id, projection = {}) {
    const objectId = toObjectId(id);
    return (objectId ? this.collection.findOne({ _id: objectId }, { projection }) : null);
  }

  async addOne(item = {}) {
    await this.collection.insertOne(item);
    return item;
  }

  async deleteOneById(id) {
    const objectId = toObjectId(id);
    if (!objectId) return null;
    const result = await this.collection.deleteOne({ _id: objectId });
    return (result.deletedCount === 0 ? null : result);
  }

  deleteAll(filter = {}) {
    return this.collection.deleteMany(filter);
  };

  async updateOneById(id, item = {}) {
    const objectId = toObjectId(id);
    if (!objectId) return null;
    const result = await this.collection.findOneAndReplace({ _id: objectId }, item, { returnOriginal: false });
    return result.value;
  };
}

module.exports = MongoModel;
