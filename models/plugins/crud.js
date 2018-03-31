module.exports = (schema) => {
  schema.statics.getById = function(id) {
    return this.findById(id).exec().catch(err => console.log(err.message));
  };

  schema.statics.getAll = function(filter = {}, sort = {}, offset = 0, limit = 20) {
    return this.find(filter).sort(sort).skip(offset).limit(limit).exec();
  };
};