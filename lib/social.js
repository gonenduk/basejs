const rp = require('request-promise');

// Social providers definition
const providers = {
  facebook: {
    url: 'https://graph.facebook.com/me',
  },
  google: {
    url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
  },
  github: {
    url: 'https://api.github.com/user',
  },
  windows: {
    url: 'https://apis.live.net/v5.0/me',
  },
};

module.exports = {
  // Check provider is on the list of providers
  isProviderSupported(provider) {
    return provider in providers;
  },

  // Send a GET request to the social provider with the token as query string
  validateWithProvider(provider, token) {
    return rp({ url: providers[provider].url, qs: { access_token: token } }).then(body => JSON.parse(body));
  },
};
