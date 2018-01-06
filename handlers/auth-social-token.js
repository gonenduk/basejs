const Boom = require('boom');
const social = require('../modules/social');
const jwt = require('jsonwebtoken');

module.exports = {
	post: (req, res, next) => {
		const provider = req.body.provider;
		const token = req.body.token;

		// Verify provider is supported
		if (!social.isProviderSupported(provider)) {
			return next(Boom.badRequest(`Unsupported provider '${provider}'`));
		}

		// Verify token with provider and get user profile data
		social.validateWithProvider(provider, token).then((profile) => {
            // Create JWT for dummy user
            jwt.sign({ id: profile.id, role: 'user' }, config.server.JWT.secret || 'secret', (err, token) => {
                if (!err) {
                    res.json({ access_token: token });
                } else {
                    next(Boom.unauthorized('Failed to sign user token'));
                }
            });
		}).catch((error) => {
			next(Boom.unauthorized(error.error));
		});
	}
};
