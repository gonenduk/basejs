module.exports = (schema) => {
  schema.statics.getOneById = function (id) {
    return this.findById(id).exec();
  };

  schema.statics.getAll = function (filter = {}, sort = {}, offset = 0, limit = 20) {
    return this.find(filter).sort(sort).skip(offset).limit(limit).exec();
  };

  schema.statics.addOne = function (item = {}) {
    return this.create(item);
  };

  schema.statics.deleteOneById = function (id) {
    return this.findByIdAndRemove(id, { select: '' }).exec();
  };

  schema.statics.deleteAll = function (filter = {}) {
    return this.deleteMany(filter).exec();
  };

  schema.statics.updateOneById = function (id, item = {}) {
    return this.update({ _id: id }, item).exec();
  };
};
