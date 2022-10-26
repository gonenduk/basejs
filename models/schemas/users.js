module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'role'],
      properties: {
        username: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        role: { enum: ['user', 'moderator', 'admin'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        signedOutAt: { bsonType: 'date' },
        oauth: {
          bsonType: 'object',
          properties: {
            facebook: { bsonType: 'string' },
            google: { bsonType: 'string' },
            apple: { bsonType: 'string' },
          },
        },
      },
    },
  },
  indexes: [
    { fields: { email: 1 }, options: { unique: true } },
    { fields: { username: 1 }, options: { unique: true, partialFilterExpression: { username: { $exists: true } } } },
    { fields: { facebook: 1 }, options: { unique: true, partialFilterExpression: { facebook: { $exists: true } } } },
    { fields: { google: 1 }, options: { unique: true, partialFilterExpression: { google: { $exists: true } } } },
    { fields: { apple: 1 }, options: { unique: true, partialFilterExpression: { apple: { $exists: true } } } },
  ],
};
