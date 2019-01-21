const mongo = require('./mongodb');

// Init async services before setting up the express app
module.exports = async () => Promise.all([
  mongo.connect(),
]);
