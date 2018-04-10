module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role"],
      properties: {
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["user", "moderator", "admin", "sysadmin"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  indexes: []
};
