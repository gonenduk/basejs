const publicResource = require('./public-resource');

module.exports = {
  getProducts: (req) => publicResource.getMany(req),
  createProduct: (req) => publicResource.create(req),
  getProduct: (req) => publicResource.getOne(req),
  updateProduct: (req) => publicResource.updateOne(req),
  deleteProduct: (req) => publicResource.deleteOne(req),
  updateProductOwner: (req) => publicResource.updateOwner(req),
};
