const config = require('config');
const jwt = require('jsonwebtoken');
const signAsync = Promise.promisify(jwt.sign);
const verifyAsync = Promise.promisify(jwt.verify);

// Default JWT options
const options = config.server.JWT || {};
Object.assign(options, {
  secret: 'secret',
  accessTTL: '1h',    // 1 hour
  refreshTTL: '7d'    // 1 week
});

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
  }
};
