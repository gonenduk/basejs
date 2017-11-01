const express = require('express');
const swaggerize = require('swaggerize-express');
const sui = require('swagger-ui-dist').getAbsoluteFSPath();
const Boom = require('boom');

// Default api options if not configured
config.api = config.api || {};

// Dedicated sub app to be used by swagger
const app = express();

// CORS support for API
app.use('/api', (req, res, next) => {
	if (config.api.cors) res.header("Access-Control-Allow-Origin", "*");
	next();
});

// Rest API - routes of resources
app.use(swaggerize({
	api: require('./api.json'),
	docspath: config.api.docs ? 'docs' : '',
	handlers: '../handlers'
}));

// Swagger UI
if (config.api.ui) {
	app.get('/api/ui', function (req, res, next) {
		if (!req.query.url) {
			res.redirect('?url=' + req.protocol + '://' + req.get('host') + '/api/docs');
		} else {
			next();
		}
	});
	app.use('/api/ui', express.static(sui));
}

// Catch 404 and forward to error handler
app.use('/api', (req, res, next) => {
	next(Boom.notFound('Path not found'));
});

// Error handler
app.use('/api', (err, req, res, next) => {
	const errPayload = Boom.boomify(err, { statusCode: err.status || 500, override: false }).output.payload;
	if (errPayload.statusCode == 500) logger.error(err.stack);
	res.status(errPayload.statusCode).json(errPayload);
});

module.exports = app;
