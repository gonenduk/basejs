/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const express = require('express');
const Boom = require('@hapi/boom');
const user = require('../models/user');
const social = require('../lib/social');
const jwt = require('../lib/jwt');

const router = express.Router();

function createJWT(match) {
  const accessPayload = { id: match._id, role: match.role };
  const refreshPayload = { id: match._id };
  return Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
    .then((tokens) => ({ access_token: tokens[0], refresh_token: tokens[1] }))
    .catch((err) => { throw Boom.unauthorized(`Failed to sign user tokens: ${err.message}`); });
}

router.post('/auth/token', async (req, res) => {
  const { username, password } = req.body;

  // Validate email/password
  const match = await user.getOne({ username }, {
    projection: {
      password: 1,
      role: 1,
    },
  });
  if (!match) {
    throw Boom.unauthorized('Incorrect username or password');
  }
  if (!(await user.validatePassword(password, match.password))) {
    throw Boom.unauthorized('Incorrect username or password');
  }

  // Create JWT with access and refresh tokens
  res.json(await createJWT(match));
});

router.delete('/auth/token', async (req, res) => {
  await user.logout(req.user.id);
  res.status(204).end();
});

router.post('/auth/refresh/token', async (req, res) => {
  // Verify refresh token
  const token = await jwt.verifyToken(req.body.token).catch((err) => {
    throw Boom.unauthorized(`Invalid refresh token: ${err.message}`);
  });

  // Find related user
  const match = await user.getOneById(token.id, { role: 1, logoutAt: 1 });
  if (!match) throw Boom.unauthorized('Invalid user in refresh token');

  // Validate user did not log off after refresh token was created
  if (match.logoutAt && token.iat * 1000 < match.logoutAt.getTime()) {
    throw Boom.unauthorized('Refresh token expired');
  }

  // Create JWT with access and refresh tokens
  res.json(await createJWT(match));
});

router.post('/auth/social/token', async (req, res) => {
  const { provider, token } = req.body;

  // Verify provider is supported
  if (!social.isProviderSupported(provider)) throw Boom.unauthorized(`Unsupported provider '${provider}'`);

  // Verify token with provider and get user profile data
  const profile = await social.validateWithProvider(provider, token).catch((err) => {
    throw Boom.unauthorized(err.error);
  });

  // Find user by email
  const match = await user.getOne({ email: profile.email }, { projection: { role: 1 } });
  if (!match) throw Boom.unauthorized('No matching user found');

  // Create JWT for dummy user
  res.json(await createJWT(match));
});

module.exports = router;
