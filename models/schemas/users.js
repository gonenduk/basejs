module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "role"],
      properties: {
        username: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["god", "admin", "moderator", "user"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  indexes: []
};
