const Boom = require('boom');
const jwt = require('../modules/jwt');

module.exports = {
	post: (req, res, next) => {
		const username = req.body.username;
		const password = req.body.password;

		// Create dummy user according to username
		let access, refresh;
		if (username === 'admin') {
			access = { id: 1, role: 'admin' };
			refresh = { id: 1 };
		} else if (username === 'user') {
            access = { id: 2, role: 'user' };
            refresh = { id: 2 };
		} else {
            return next(Boom.unauthorized(`Invalid dummy user type '${username}'`));
		}

		// Create JWT for dummy user
		Promise.all([
			jwt.signAccessToken(access),
			jwt.signRefreshToken(refresh)
		]).then((tokens) => {
			res.json({ access_token: tokens[0], refresh_token: tokens[1] });
		}).catch(() => {
			next(Boom.unauthorized('Failed to sign user tokens'));
		});
	}
};
