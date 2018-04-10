const Boom = require('boom');

module.exports = {
  home: (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip === '::1') ip = '127.0.0.1';
    res.render('index', { ip });
  },

  ping: (req, res, next) => {
    res.send('pong');
  }
};
