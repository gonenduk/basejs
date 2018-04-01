const Boom = require('boom');

module.exports = function (model, handler = {}) {
  const mixin = Object.create(handler);

  mixin.get =  async (req, res, next) => {
    // Get id
    const id = req.pathParams.id;

    // Get item
    try {
      const item = await model.getOneById(id);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.json(item);
    }
    catch (err) {
      next(err);
    }
  };

  return mixin;
};
