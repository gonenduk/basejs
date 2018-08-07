const jwt = require('jsonwebtoken');
const options = require('./options')('server.JWT.3.4');

const signAsync = Promise.promisify(jwt.sign);
const verifyAsync = Promise.promisify(jwt.verify);

function signJWT(payload, ttl) {
  return signAsync(payload, options.secret, { expiresIn: ttl });
}

module.exports = {
  signAccessToken(payload) {
    return signJWT(payload, options.accessTTL);
  },

  signRefreshToken(payload) {
    return signJWT(payload, options.refreshTTL);
  },

  verifyToken(token) {
    return verifyAsync(token, options.secret);
  },

  get options() {
    return options;
  },
};
