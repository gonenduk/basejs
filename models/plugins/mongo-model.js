const logger = require('../../lib/logger');
const connection = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

class MongoModel {
  constructor (collectionName, schema) {
    connection.then(db => {
      if (db)
        this.init(db, collectionName, schema);
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

  getAll(filter = {}, sort = {}, offset = 0, limit = 20) {
    return this.collection.find(filter).sort(sort).skip(offset).limit(limit).toArray();
  }

  getOneById(id) {
    // Invalid id should return not found
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return null;
    }

    return this.collection.findOne({ _id: objectId });
  }
}

module.exports = MongoModel;
