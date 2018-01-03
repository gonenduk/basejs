const request = require('request');

// Social providers definition
const providers = {
	facebook: {
		url: 'https://graph.facebook.com/me'
	},
	google: {
		url: 'https://www.googleapis.com/oauth2/v3/tokeninfo'
	},
	github: {
		url: 'https://api.github.com/user'
	},
	windows: {
		url: 'https://apis.live.net/v5.0/me'
	}
};

module.exports = {
	validateWithProvider(network, socialToken) {
		return new Promise((resolve, reject) => {
			// Send a GET request to the social provider with the token as query string
			request({ url: providers[network].url, qs: { access_token: socialToken } }, (error, response, body) => {
				if (!error && response.statusCode === 200) {
					resolve(JSON.parse(body));
				} else {
					reject(error);
				}
			});
		});
	}
};
