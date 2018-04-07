module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role"],
      properties: {
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["god", "admin", "moderator", "user"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  indexes: []
};
