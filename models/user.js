const db = require('../lib/mongodb');
const crud = require('./plugins/crud');
const hideVersion = require('./plugins/hide-version');
const Schema = db.base.Schema;

const userSchema = new Schema({
  username: String,
  password: String
});

userSchema.plugin(crud);
userSchema.plugin(hideVersion);

module.exports = db.model('User', userSchema);
