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
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              provider: { bsonType: 'string' },
              id: { bsonType: 'string' },
            },
          },
        },
      },
    },
  },
  indexes: [
    { fields: { email: 1 }, options: { unique: true } },
    { fields: { username: 1 }, options: { unique: true, partialFilterExpression: { username: { $exists: true } } } },
    {
      fields: { 'oauth.provider': 1, 'oauth.id': 1 },
      options: {
        unique: true,
        partialFilterExpression: { $and: [{ 'oauth.provider': { $exists: true } }, { 'oauth.id': { $exists: true } }] },
      },
    },
  ],
};
