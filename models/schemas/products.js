module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "price"],
      properties: {
        title: { bsonType: "string" },
        price: { bsonType: "number" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  indexes: []
};
