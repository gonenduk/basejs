const mongo = require('./mongodb');
// const redis = require('./redis');

// Init async services before setting up the express app
module.exports = async () => Promise.all([
  mongo.connect(),
  // redis.connect(),
]);
