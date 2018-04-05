module.exports = {
  $jsonSchema: {
    bsonType: "object",
    required: ["title", "price"],
    properties: {
      title: { bsonType: "string" },
      price: { bsonType: "number" }
    }
  }
};
