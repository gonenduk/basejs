const express = require('express');
const aclValidations = require('./validations');

const router = express.Router();

router.use('/products', aclValidations.public);

module.exports = router;
