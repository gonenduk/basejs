/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Boom = require('boom');
const user = require('../models/user');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    const { username, password } = req.body;

    // Validate email/password
    const match = await user.getOne({ username }, { projection: { password: 1, role: 1 } });
    if (!match) {
      return next(Boom.unauthorized('Incorrect username or password'));
    }
    if (!(await user.validatePassword(password, match.password))) {
      return next(Boom.unauthorized('Incorrect username or password'));
    }

    // Create JWT with access and refresh tokens
    const accessPayload = { id: match._id, role: match.role };
    const refreshPayload = { id: match._id };
    return Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
      .then(tokens => res.json({ access_token: tokens[0], refresh_token: tokens[1] }))
      .catch(err => next(Boom.unauthorized(`Failed to sign user tokens: ${err.message}`)));
  },

  delete: async (req, res) => {
    await user.logout(req.user.id);
    res.status(204).end();
  },
};
