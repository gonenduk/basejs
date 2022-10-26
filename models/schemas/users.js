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
        signedOutAt: { bsonType: 'date' },
      },
    },
  },
  indexes: [
    { fields: { email: 1 }, options: { unique: true } },
    { fields: { username: 1 }, options: { unique: true, partialFilterExpression: { username: { $exists: true } } } },
  ],
};
