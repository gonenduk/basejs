const user = require('../models/user');
const Boom = require('boom');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt-nodejs');
const compareAsync = Promise.promisify(bcrypt.compare);

module.exports = {
  post: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const refresh = req.body.refresh;
    let match;

    // Validate email/password or refresh token
    if (email || password) {
      match = await user.getOne({ email }, { projection: { password: 1, role: 1 }});
      if (!match) return next(Boom.unauthorized('Incorrect email or password'));
      try {
        if (!(await compareAsync(password, match.password)))
          return next(Boom.unauthorized('Incorrect email or password'));
      } catch (err) {
        return next(Boom.unauthorized('Incorrect email or password'));
      }
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
      return next(Boom.unauthorized('Must provide email/password or refresh token'));

    // Create JWT with access and refresh tokens
    const accessPayload = { id: match._id, role: match.role };
    const refreshPayload = { id: match._id };
    Promise.all([jwt.signAccessToken(accessPayload), jwt.signRefreshToken(refreshPayload)])
      .then(tokens => res.json({ access_token: tokens[0], refresh_token: tokens[1] }))
      .catch(err => next(Boom.unauthorized(`Failed to sign user tokens: ${err.message}`)));
  }
};
