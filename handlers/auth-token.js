const Boom = require('boom');
const jwt = require('../modules/jwt');

module.exports = {
	post: (req, res, next) => {
		const username = req.body.username;
		const password = req.body.password;

		// Create dummy user according to username
		let user;
		if (username === 'admin') {
			user = { id: 1, role: 'admin' };
		} else if (username === 'user') {
            user = { id: 2, role: 'user' };
		} else {
            return next(Boom.unauthorized(`Invalid dummy user type '${username}'`));
		}

		// Create JWT for dummy user
		jwt.signAccessToken(user).then((token) => {
	        res.json({ access_token: token });
        }).catch(() => {
        	next(Boom.unauthorized('Failed to sign user token'));
		});
	}
};
