const request = require('supertest');
const express = require('express');
const router = require('../../acl');
const errorRouter = require('../../routes/error');

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
  res.send(req.query.filter);
});
app.use(errorRouter);

describe('Access control for /profiles', () => {
  context('Get resource', () => {
    it('should allow guest to read any', (done) => {
      testUser = guest;
      request(app)
        .get('/profiles/3')
        .expect(200, {}, done);
    });
  });
});
