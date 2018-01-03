const express = require('express');
const handlers = require('../handlers');
const Boom = require('boom');
const path = require('path');
const router = express.Router();

// Pages
router.get('/', handlers.web.home);
router.get('/ping', handlers.web.ping);

// Catch 404 and forward to error handler
router.use((req, res, next) => {
	next(Boom.notFound('Page not found'));
});

module.exports = router;
