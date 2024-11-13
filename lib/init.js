const config = require('config');
const mongo = require('./mongodb');
const redis = require('./redis');

// Init async services before setting up the express app
module.exports = async () => {
  const services = [];
  if (config.has('mongodb.url')) services.push(mongo.connect());
  if (config.has('redis.host')) services.push(redis.connect());
  return Promise.all(services);
};
