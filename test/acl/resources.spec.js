const request = require('supertest');
const express = require('express');
require('../../acl');
const router = require('../../acl/validations/public');

const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
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
// noinspection JSUnusedLocalSymbols
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.output.statusCode).end();
});

describe('Access control for resources', () => {
  context('Create resource', () => {
    it('should allow user to create', (done) => {
      testUser = user;
      request(app)
        .post('/')
        .expect(200, done);
    });

    it('should not allow guest to create', (done) => {
      testUser = guest;
      request(app)
        .post('/')
        .expect(403, done);
    });
  });

  context('Update resource', () => {
    it('should allow user to update own', (done) => {
      testUser = user;
      request(app)
        .patch('/3')
        .expect(200, { ownerId: '3' }, done);
    });

    it('should not allow moderator to update any', (done) => {
      testUser = moderator;
      request(app)
        .patch('/3')
        .expect(200, { ownerId: '2' }, done);
    });

    it('should allow admin to update any', (done) => {
      testUser = admin;
      request(app)
        .patch('/3')
        .expect(200, {}, done);
    });
  });

  context('Delete resource', () => {
    it('should allow user to delete own', (done) => {
      testUser = user;
      request(app)
        .delete('/3')
        .expect(200, { ownerId: '3' }, done);
    });

    it('should not allow moderator to delete any', (done) => {
      testUser = moderator;
      request(app)
        .delete('/3')
        .expect(200, { ownerId: '2' }, done);
    });

    it('should allow admin to delete any', (done) => {
      testUser = admin;
      request(app)
        .delete('/3')
        .expect(200, {}, done);
    });
  });

  context('Update resource ownership', () => {
    it('should not allow moderator to update own', (done) => {
      testUser = moderator;
      request(app)
        .put('/2/owner')
        .expect(403, done);
    });

    it('should allow admin to update any', (done) => {
      testUser = admin;
      request(app)
        .put('/2/owner')
        .expect(200, {}, done);
    });
  });
});
