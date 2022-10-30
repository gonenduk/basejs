const sa = require('superagent');
const providers = require('./options')('oauth');

module.exports = {
  // Check provider is on the list of providers
  isProviderSupported(provider) {
    return provider in providers;
  },

  // Send a GET request to the oauth provider with the token as query string
  validateWithProvider(provider, token) {
    return sa.get(providers[provider]).query({ access_token: token }).then((res) => JSON.parse(res.body));
  },
};
