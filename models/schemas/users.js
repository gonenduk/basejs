module.exports = {
  $jsonSchema: {
    bsonType: "object",
    required: ["username"],
    properties: {
      username: { bsonType: "string" },
      password: { bsonType: "string" }
    }
  }
};
