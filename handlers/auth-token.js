const user = require('../models/user');
const Boom = require('boom');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const refresh = req.body.refresh;
    let match;

    // Validate username/password or refresh token
    if (username || password) {
      match = await user.getOne({ username, password }, { projection: { role: 1 }});
      if (!match) return next(Boom.unauthorized('Incorrect username or password'));
    } else if (refresh) {
      let id;
      try {
        id = (await jwt.verifyToken(refresh)).id;
      } catch (err) {
        return next(Boom.unauthorized(`Invalid refresh token: ${err.message}`));
      }
      match = await user.getOneById(id, { role: 1 });
      if (!match) return next(Boom.unauthorized('Invalid user in refresh token'));
    } else
      return next(Boom.unauthorized('Must provide username/password or refresh token'));

    // Create JWT with access and refresh tokens
    const accessPayload = { id: match._id, role: match.role };
    const refreshPayload = { id: match._id };
    Promise.all([
      jwt.signAccessToken(accessPayload),
      jwt.signRefreshToken(refreshPayload)
    ]).then(tokens => {
      res.json({ access_token: tokens[0], refresh_token: tokens[1] });
    }).catch(() => {
      next(Boom.unauthorized('Failed to sign user tokens'));
    });
  }
};
