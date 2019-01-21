const express = require('express');
const config = require('config');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const logger = require('./lib/logger');

// Create express app and export it before requiring routes
const app = express();
module.exports = app;

const web = require('./routes/web');
const api = require('./routes/api');
const common = require('./routes/common');
const error = require('./routes/error');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// General app setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(morgan(config.get('morgan').format, { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.config = config;

// Wait for routes to be defined (order is important)
Promise.all([common, api, web, error])
  .then((routers) => {
    // Routes setup
    routers.forEach((router) => {
      app.use(router);
    });

    // Message routes are ready
    logger.info('Routes are ready');
    app.emit('routes:ready');
  });
