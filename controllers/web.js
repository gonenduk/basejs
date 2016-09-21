const Boom = require('boom');

module.exports = {
  home: (req, res, next) => {
    res.render('index');
  },

  ping: (req, res, next) => {
    res.send('pong');
  },

  // Replace userId set to 'me' with logged in user id
  userId: (req, res, next, userId) => {
    if (userId == 'me') {
      if (!req.user || !req.user.id) {
        return next(Boom.unauthorized('Not logged in'));
      }
      req.params.userId = req.user.id;
    }
    next();
  },

  // Catch 404 and forward to error handler
  error404: (req, res, next) => {
    next(Boom.notFound('Page not found'));
  },

  // Error handler
  error: (err, req, res, next) => {
    const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
    if (errPayload.statusCode == 500) {
      logger.error(err.stack);
    }
    res.status(errPayload.statusCode).render('error', {error: errPayload});
  }
};
