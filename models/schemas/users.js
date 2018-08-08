module.exports = {
  schema: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'role'],
      properties: {
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
    { fields: { email: 1 }, options: { unique: true } },
  ],
};
