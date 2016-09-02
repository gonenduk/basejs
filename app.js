const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Boom = require('boom');

const routes = require('./routes/web');
const api = require('./routes/api');

const app = module.exports = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// General app setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan(config.morgan.format, { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/api', api);
app.use('/', routes);

/**
 * Page errors default handlers
 */

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	next(Boom.notFound('Page not found'));
});

// Error handler
app.use((err, req, res, next) => {
	const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  if (errPayload.statusCode == 500) {
    logger.error(err.stack);
  }
	res.status(errPayload.statusCode).render('error', {error: errPayload});
});
