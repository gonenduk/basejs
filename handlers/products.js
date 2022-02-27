const BaseHandler = require('./base-handler');
const model = require('../models/product');

const baseHandler = new BaseHandler(model);

module.exports = {
  getProducts: (req, res) => baseHandler.getMany(req, res),
  createProduct: (req, res) => baseHandler.create(req, res),
  getProduct: (req, res) => baseHandler.getOne(req, res),
  updateProduct: (req, res) => baseHandler.updateOne(req, res),
  deleteProduct: (req, res) => baseHandler.deleteOne(req, res),
  updateProductOwner: (req, res) => baseHandler.updateOwner(req, res),
};
