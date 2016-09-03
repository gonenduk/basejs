const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

// home page
router.get('/', controllers.web.home);

// ping
router.get('/ping', controllers.web.ping);

// Error handlers
router.use(controllers.web.error404);
router.use(controllers.web.error);

module.exports = router;
