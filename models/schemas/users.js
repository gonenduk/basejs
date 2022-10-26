/* eslint-disable max-len */
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
    { fields: { 'oauth.facebook': 1 }, options: { unique: true, partialFilterExpression: { 'oauth.facebook': { $exists: true } } } },
    { fields: { 'oauth.google': 1 }, options: { unique: true, partialFilterExpression: { 'oauth.google': { $exists: true } } } },
    { fields: { 'oauth.apple': 1 }, options: { unique: true, partialFilterExpression: { 'oauth.apple': { $exists: true } } } },
  ],
};
