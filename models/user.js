const MongoModel = require('./mongo-model');

class User extends MongoModel {
}

module.exports = new User('users');
