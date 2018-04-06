module.exports = {
  $jsonSchema: {
    bsonType: "object",
    required: ["username"],
    properties: {
      username: { bsonType: "string" },
      password: { bsonType: "string" },
      role: {bsonType: "string"},
      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" }
    }
  }
};
