const express = require('express');
const Boom = require('boom');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET ping
router.get('/ping', (req, res, next) => {
  res.send('pong');
});

module.exports = router;
