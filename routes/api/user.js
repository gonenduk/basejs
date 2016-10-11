const express = require('express');
const validations = require('./validations/user');
const controllers = require('../../controllers/api/user');
const Celebrate = require('celebrate');
const Boom = require('boom');
const router = express.Router();

/**
 * @swagger
 * definition:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: Returns users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
router.get('/', controllers.getBulk);

// Get user
router.get('/:userId', Celebrate(validations.get), controllers.get);

// Replace userId set to 'me' with logged in user id
router.param('userId', (req, res, next, userId) => {
  if (userId == 'me') {
    if (!req.user || !req.user.id) {
      return next(Boom.unauthorized('Not logged in'));
    }
    req.params.userId = req.user.id;
  }
  next();
});

module.exports = router;
