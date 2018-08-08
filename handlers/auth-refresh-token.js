/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Boom = require('boom');
const user = require('../models/user');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    // Verify refresh token
    let token;
    try {
      token = await jwt.verifyToken(req.body.token);
    } catch (err) {
      return next(Boom.unauthorized(`Invalid refresh token: ${err.message}`));
    }

    // Find related user
    const match = await user.getOneById(token.id, { role: 1, logoutAt: 1 });
    if (!match) return next(Boom.unauthorized('Invalid user in refresh token'));

    // Validate user did not log off after refresh token was created
    if (token.iat * 1000 < match.logoutAt.getTime()) return next(Boom.unauthorized('Refresh token expired'));

    // Create JWT with access and refresh tokens
    const accessPayload = { id: match._id, role: match.role };
    const refreshPayload = { id: match._id };
    return Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
      .then(tokens => res.json({ access_token: tokens[0], refresh_token: tokens[1] }))
      .catch(err => next(Boom.unauthorized(`Failed to sign user tokens: ${err.message}`)));
  },
};
