module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "ownerId"],
      properties: {
        title: { bsonType: "string" },
        price: { bsonType: "number" },
        // Shared properties
        ownerId: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  indexes: [
    { fields: { "ownerId": 1 }, options: {} }
  ]
};
