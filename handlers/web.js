const Boom = require('boom');

module.exports = {
  home: (req, res, next) => {
    res.render('index');
  },

  ping: (req, res, next) => {
    res.send(`pong to ${req.ip}`);
  }
};
