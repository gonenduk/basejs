/* eslint no-unused-vars: "off" */
const request = require('supertest');
const express = require('express');
require('../../acl');
const router = require('../../acl/validations/public');

const guest = { role: 'guest' };
let testUser;

const app = express();

app.use((req, res, next) => {
  req.user = testUser;
  next();
});
app.use(router);
app.use((req, res) => {
  res.send(req.query.filter);
});
app.use((err, req, res, next) => {
  res.status(err.output.statusCode).end();
});

describe('Access control for public resources', () => {
  context('Get list', () => {
    it('should allow guest to read', (done) => {
      testUser = guest;
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  context('Get resource', () => {
    it('should allow guest to read any', (done) => {
      testUser = guest;
      request(app)
        .get('/3')
        .expect(200, {}, done);
    });
  });
});
