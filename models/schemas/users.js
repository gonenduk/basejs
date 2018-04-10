module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role"],
      properties: {
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["sysadmin", "admin", "moderator", "user"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  indexes: []
};
