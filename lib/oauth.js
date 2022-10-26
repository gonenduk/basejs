const sa = require('superagent');

// OAuth providers definition
const providers = {
  facebook: {
    url: 'https://graph.facebook.com/me',
  },
  google: {
    url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
  },
};

module.exports = {
  // Check provider is on the list of providers
  isProviderSupported(provider) {
    return provider in providers;
  },

  // Send a GET request to the oauth provider with the token as query string
  validateWithProvider(provider, token) {
    return sa.get(providers[provider].url).query({ access_token: token }).then((res) => JSON.parse(res.body));
  },
};
