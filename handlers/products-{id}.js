const Product = require('../models/product');
const Boom = require('boom');

module.exports = {
  get: async (req, res, next) => {
    // Get id
    const id = req.query.limit;

    // Get list of products
    try {
      const product = await Product.getById(id);
      if (!product) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.json(product);
    }
    catch (err) {
      next(err);
    }
  }
};
