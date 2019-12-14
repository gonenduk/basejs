const jwt = require('jsonwebtoken');
const util = require('util');
const { secret, accessTTL, refreshTTL } = require('./options')('server.JWT');

const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

function signJWT(payload, ttl) {
  return signAsync(payload, secret, { expiresIn: ttl });
}

module.exports = {
  signAccessToken(payload) {
    return signJWT(payload, accessTTL);
  },

  signRefreshToken(payload) {
    return signJWT(payload, refreshTTL);
  },

  verifyToken(token) {
    return verifyAsync(token, secret);
  },

  get secret() {
    return secret;
  },
};
