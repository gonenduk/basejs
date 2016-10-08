const express = require('express');
const router = express.Router();

router.all('*', (req, res, next) => {
  // Create a default guest user if no user logged in
  if (!req.user) {
    req.user = { role: 'guest' };
  }
  next();
});

module.exports = router;
