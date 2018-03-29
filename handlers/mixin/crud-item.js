const Boom = require('boom');

module.exports = function (model, handler = {}) {
  const mixin = Object.create(handler);

  mixin.get =  async (req, res, next) => {
    // Get id
    const id = req.query.limit;

    // Get item
    try {
      const product = await model.getById(id);
      if (!product) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.json(product);
    }
    catch (err) {
      next(err);
    }
  };

  return mixin;
};
