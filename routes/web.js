const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

// Pages
router.get('/', controllers.web.home);
router.get('/ping', controllers.web.ping);

// Parameter handlers
router.param('userId', controllers.web.userId);

// Error handlers
router.use(controllers.web.error404);
router.use(controllers.web.error);

module.exports = router;
