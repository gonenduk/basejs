const express = require('express');
const validations = require('./validations');
const controllers = require('../controllers');
const Celebrate = require('celebrate');
const router = express.Router();

// API root
router.get('/', controllers.api.get);

// User
router.get('/users/:id', Celebrate(validations.user.get), controllers.user.get);

// Error handlers
router.use(controllers.api.error404);
router.use(controllers.api.error);

module.exports = router;
