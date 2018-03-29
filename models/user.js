const db = require('../lib/mongodb');
const crud = require('./plugins/crud');
const Schema = db.base.Schema;

const userSchema = new Schema({
  username: String,
  password: String
});

userSchema.plugin(crud);

module.exports = db.model('User', userSchema);
