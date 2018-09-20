module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'role'],
      properties: {
        username: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        role: { enum: ['user', 'moderator', 'admin'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        logoutAt: { bsonType: 'date' },
      },
    },
  },
  indexes: [
    { fields: { username: 1 }, options: { unique: true } },
    { fields: { email: 1 }, options: { unique: true, partialFilterExpression: { email: { $exists: true } } } },
  ],
};
