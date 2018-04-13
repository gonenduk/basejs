const user = require('../models/user');
const Boom = require('boom');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    // Verify refresh token
    let id;
    try {
      id = (await jwt.verifyToken(req.body.token)).id;
    } catch (err) {
      return next(Boom.unauthorized(`Invalid refresh token: ${err.message}`));
    }

    // Find related user
    const match = await user.getOneById(id, { role: 1 });
    if (!match) return next(Boom.unauthorized('Invalid user in refresh token'));

    // Create JWT with access and refresh tokens
    const accessPayload = { id: match._id, role: match.role };
    const refreshPayload = { id: match._id };
    Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
      .then(tokens => res.json({ access_token: tokens[0], refresh_token: tokens[1] }))
      .catch(err => next(Boom.unauthorized(`Failed to sign user tokens: ${err.message}`)));
  }
};
