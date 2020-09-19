const request = require('supertest');
const express = require('express');
const router = require('../../acl');
const errorRouter = require('../../routes/error');

const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };
let testUser;

const app = express();

app.use((req, res, next) => {
  req.api = true;
  req.user = testUser;
  next();
});
app.use(router);
app.use((req, res) => {
  res.end();
});
app.use(errorRouter);

describe('Access control for /users', () => {
  context('Get user list', () => {
    it('should allow moderator to read', (done) => {
      testUser = moderator;
      request(app)
        .get('/users')
        .expect(200, done);
    });

    it('should not allow user to read', (done) => {
      testUser = user;
      request(app)
        .get('/users')
        .expect(403, done);
    });
  });

  context('Create user', () => {
    it('should allow guest to create', (done) => {
      testUser = guest;
      request(app)
        .post('/users')
        .expect(200, done);
    });
  });

  context('Get user', () => {
    it('should allow user to read own', (done) => {
      testUser = user;
      request(app)
        .get('/users/3')
        .expect(200, done);
    });

    it('should allow moderator to read any', (done) => {
      testUser = moderator;
      request(app)
        .get('/users/3')
        .expect(200, done);
    });

    it('should not allow user to read any', (done) => {
      testUser = user;
      request(app)
        .get('/users/2')
        .expect(403, done);
    });
  });

  context('Update user', () => {
    it('should allow user to update own', (done) => {
      testUser = user;
      request(app)
        .patch('/users/3')
        .expect(200, done);
    });

    it('should not allow moderator to update any', (done) => {
      testUser = moderator;
      request(app)
        .patch('/users/3')
        .expect(403, done);
    });

    it('should allow admin to update any', (done) => {
      testUser = admin;
      request(app)
        .patch('/users/3')
        .expect(200, done);
    });
  });

  context('Update user role', () => {
    it('should not allow moderator to update own', (done) => {
      testUser = moderator;
      request(app)
        .put('/users/3/role')
        .expect(403, done);
    });

    it('should allow admin to update any', (done) => {
      testUser = admin;
      request(app)
        .put('/users/3/role')
        .expect(200, done);
    });
  });
});
