const Boom = require('boom');
const jwt = require('jsonwebtoken');

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
		jwt.sign(user, config.server.JWT.secret || 'secret', (err, token) => {
			if (!err) {
                res.json({token});
            } else {
				next(Boom.unauthorized('Failed to create user token'));
			}
		});
	}
};
