const express = require('express');
const validation = require('./validations');
const Celebrate = require('celebrate');
const router = express.Router();

/* GET API listing. */
router.get('/', /*Celebrate(validation.resource-name.get),*/ (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
