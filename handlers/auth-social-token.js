const Boom = require('boom');
const social = require('../lib/social');
const jwt = require('../lib/jwt');

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
			Promise.all([
				jwt.signAccessToken({ id: profile.id, role: 'user' }),
				jwt.signRefreshToken({ id: profile.id })
			]).then((tokens) => {
				res.json({ access_token: tokens[0], refresh_token: tokens[1] });
			}).catch(() => {
				next(Boom.unauthorized('Failed to sign user tokens'));
			});
		}).catch((error) => {
			next(Boom.unauthorized(error.error));
		});
	}
};
