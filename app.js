const express = require('express');
const config = require('config');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Boom = require('boom');

const routes = require('./routes/index');
const api = require('./routes/api');

const app = module.exports = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// General app setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(config.morgan.format, config.morgan.options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', routes);
app.use('/api', api);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(Boom.notFound());
});

// Error handlers
app.use((err, req, res, next) => {
  Boom.wrap(err, err.isJoi ? 400 : 500);
  err.stack = config.log.stackTrace ? err.stack : '';
  res.status(err.output.statusCode).render('error', {error: err});
});
