const express = require('express');
const router = express.Router();

router.all('*', (req, res, next) => {
  // Create a default guest user if no user logged in
  if (!req.user) {
    req.user = { role: 'guest' };
  }

  // Put user and config on response object to be accessible from all templates
  res.locals.config = config;
  res.locals.user = req.user;

  next();
});

module.exports = router;
