const config = require('config');
const mongo = require('./mongodb');
const redis = require('./redis');

// Init async services before setting up the express app
module.exports = async () => Promise.all([
  config.has('mongodb') ? mongo.connect() : Promise.resolve(),
  config.has('redis') ? redis.connect() : Promise.resolve(),
]);
