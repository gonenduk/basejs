const db = require('../lib/mongoose');
const crud = require('./plugins/crud');
const hideVersion = require('./plugins/hide-version');
const Schema = db.base.Schema;

const userSchema = new Schema({
  username: String,
  password: String
});

userSchema.plugin(crud);
userSchema.plugin(hideVersion);

// Remove delete operations
userSchema.statics.deleteAll = undefined;
userSchema.statics.deleteOneById = undefined;

module.exports = db.model('User', userSchema);
