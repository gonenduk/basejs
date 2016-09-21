const Joi = require('joi');

module.exports = {
  get: {
    params: {
      userId: Joi.number()
    }
  }
};
