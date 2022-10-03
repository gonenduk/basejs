const PublicResource = require('./public-resource');

class Products extends PublicResource {
  getProducts(req) { this.getMany(req); }

  createProduct(req) { this.create(req); }

  getProduct(req) { this.getOne(req); }

  updateProduct(req) { this.updateOne(req); }

  deleteProduct(req) { this.deleteOne(req); }

  updateProductOwner(req) { this.updateSystem(req); }
}

module.exports = new Products();
