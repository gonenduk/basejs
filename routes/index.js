var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET ping */
router.get('/ping', function(req, res, next) {
  res.send('pong');
});

module.exports = router;
