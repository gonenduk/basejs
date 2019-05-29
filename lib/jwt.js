const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const { secret, accessTTL, refreshTTL } = require('./options')('server.JWT');

const signAsync = Promise.promisify(jwt.sign);
const verifyAsync = Promise.promisify(jwt.verify);

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
