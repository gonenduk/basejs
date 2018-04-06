const user = require('../models/user');
const Boom = require('boom');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const match = await user.getOne({ username, password }, { projection: { role: 1 }});
    if (!match) return next(Boom.unauthorized(`Incorrect username or password`));

    // Create JWT for dummy user
    const access = { id: match._id, role: match.role };
    const refresh = { id: match._id };
    Promise.all([
      jwt.signAccessToken(access),
      jwt.signRefreshToken(refresh)
    ]).then(tokens => {
      res.json({ access_token: tokens[0], refresh_token: tokens[1] });
    }).catch(() => {
      next(Boom.unauthorized('Failed to sign user tokens'));
    });
  }
};
