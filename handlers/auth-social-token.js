/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Boom = require('boom');
const user = require('../models/user');
const social = require('../lib/social');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    const { provider, token } = req.body;

    // Verify provider is supported
    if (!social.isProviderSupported(provider)) {
      return next(Boom.badRequest(`Unsupported provider '${provider}'`));
    }

    // Verify token with provider and get user profile data
    let profile;
    try {
      profile = await social.validateWithProvider(provider, token);
    } catch (err) {
      next(Boom.unauthorized(err.error));
    }

    // Find user by email
    const match = await user.getOne({ email: profile.email }, { projection: { role: 1 } });
    if (!match) return next(Boom.unauthorized('No matching user found'));

    // Create JWT for dummy user
    const accessPayload = { id: match._id, role: match.role };
    const refreshPayload = { id: match._id };
    return Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
      .then(tokens => res.json({ access_token: tokens[0], refresh_token: tokens[1] }))
      .catch(err => next(Boom.unauthorized(`Failed to sign user tokens: ${err.message}`)));
  },
};
