module.exports = (schema) => {
  schema.statics.getById = function(id) {
    return this.findById(id).exec();
  };

  schema.statics.getAll = function (filter = {}, sort = {}, offset = 0, limit = 20) {
    return this.find(filter).sort(sort).skip(offset).limit(limit).exec();
  };

  schema.statics.add = function (item = {}) {
    return this.create(item);
  };

  schema.statics.deleteAll = function (filter = {}) {
    return this.deleteMany(filter).exec();
  };
};
