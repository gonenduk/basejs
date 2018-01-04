const Boom = require('boom');
const social = require('../modules/social');

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
			// Create JWT
			res.json({ token: 'to-do' });
		}).catch((error) => {
			next(Boom.unauthorized(error.error));
		});
	}
};
