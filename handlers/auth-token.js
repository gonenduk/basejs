const user = require('../models/user');
const Boom = require('boom');
const jwt = require('../lib/jwt');

module.exports = {
  post: async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const match = await user.getMany({ username, password }, null, 0, 1);
    if (match.length === 0) return next(Boom.unauthorized(`Incorrect username or password`));

    // Create dummy user according to username
    let access, refresh;
    if (username === 'admin') {
      access = { id: 1, role: 'admin' };
      refresh = { id: 1 };
    } else if (username === 'user') {
      access = { id: 2, role: 'user' };
      refresh = { id: 2 };
    } else {
      return next(Boom.unauthorized(`Invalid dummy user type '${username}'`));
    }

    // Create JWT for dummy user
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
