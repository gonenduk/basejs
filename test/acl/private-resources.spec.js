/* eslint no-unused-vars: "off" */
const request = require('supertest');
const express = require('express');
require('../../acl');
const router = require('../../acl/validations/private');

const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
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

describe('Access control for private resources', () => {
  context('Get list', () => {
    it('should allow moderator to read', (done) => {
      testUser = moderator;
      request(app)
        .get('/')
        .expect(200, done);
    });

    it('should not allow user to read', (done) => {
      testUser = user;
      request(app)
        .get('/')
        .expect(403, done);
    });
  });

  context('Get resource', () => {
    it('should allow user to read own', (done) => {
      testUser = user;
      request(app)
        .get('/3')
        .expect(200, { ownerId: '3' }, done);
    });

    it('should allow moderator to read any', (done) => {
      testUser = moderator;
      request(app)
        .get('/3')
        .expect(200, {}, done);
    });

    it('should not allow user to read any', (done) => {
      testUser = user;
      request(app)
        .get('/4')
        .expect(200, { ownerId: '3' }, done);
    });
  });
});
