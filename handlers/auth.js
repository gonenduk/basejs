/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Boom = require('@hapi/boom');
const user = require('../models/user');
const oauth = require('../lib/oauth');
const jwt = require('../lib/jwt');

function createJWT(match) {
  const accessPayload = { id: match._id, role: match.role };
  const refreshPayload = { id: match._id };
  return Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
    .then((tokens) => ({ access_token: tokens[0], refresh_token: tokens[1] }))
    .catch((err) => { throw Boom.unauthorized(`Failed to sign user tokens: ${err.message}`); });
}

module.exports = {
  signInWithCredentials: async (req, res) => {
    const { username, password } = req.body;

    // Validate email/username and password
    const projection = { password: 1, role: 1 };
    const match = await user.getOneByFilter({ $or: [{ email: username }, { username }] }, { projection });
    if (!match) {
      throw Boom.unauthorized('Incorrect credentials');
    }
    if (!(await user.validatePassword(password, match.password))) {
      throw Boom.unauthorized('Incorrect credentials');
    }

    // Create JWT with access and refresh tokens
    res.json(await createJWT(match));
  },

  signInWithRefreshToken: async (req, res) => {
    // Verify refresh token
    const token = await jwt.verifyToken(req.body.token).catch((err) => {
      throw Boom.unauthorized(`Invalid refresh token: ${err.message}`);
    });

    // Find related user
    const projection = { role: 1, signedOutAt: 1 };
    const match = await user.getOneById(token.id, {}, { projection });
    if (!match) throw Boom.unauthorized('Invalid user in refresh token');

    // Validate user did not log off after refresh token was created
    if (match.signedOutAt && token.iat * 1000 < match.signedOutAt.getTime()) {
      throw Boom.unauthorized('Refresh token expired');
    }

    // Create JWT with access and refresh tokens
    res.json(await createJWT(match));
  },
  signInWithOAuthToken: async (req, res) => {
    const { provider, token } = req.body;

    // Verify provider is supported
    if (!oauth.isProviderSupported(provider)) throw Boom.unauthorized(`Unsupported provider '${provider}'`);

    // Verify token with provider and get user profile data
    const profile = await oauth.validateWithProvider(provider, token).catch((err) => {
      throw Boom.unauthorized(err.error);
    });

    // Find user by provider id
    const projection = { role: 1 };
    const match = await user.getOneByFilter({ [provider]: profile.id }, { projection });
    if (!match) throw Boom.unauthorized('No matching user found');

    // Create JWT with access and refresh tokens
    res.json(await createJWT(match));
  },

  signOut: async (req, res) => {
    await user.signOut(req.user.id);
    res.status(204).end();
  },

  disconnectOAuthProvider: async (req, res) => {
    const { provider } = req.body;

    // Verify provider is supported
    if (!oauth.isProviderSupported(provider)) throw Boom.unauthorized(`Unsupported provider '${provider}'`);

    await user.disconnectOAuthProvider(req.user.id, provider);
    res.status(204).end();
  },
};
