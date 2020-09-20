const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const acl = require('../../lib/acl');
require('../../acl');
const router = require('../../routes/web');
const errorRouter = require('../../routes/error');

const app = express();

app.use((req, res, next) => {
  res.render = () => res.send('text');
  req.user = { role: 'guest' };
  next();
});
app.use(router);
app.use(errorRouter);

describe('Web router', () => {
  after(() => {
    sinon.restore();
  });

  it('should return home page', (done) => {
    request(app)
      .get('/')
      .expect(200, 'text', done);
  });

  it('should return home page on local machine', (done) => {
    request(app)
      .get('/')
      .set('x-forwarded-for', '::1')
      .expect(200, 'text', done);
  });

  it('should return pong on ping', (done) => {
    request(app)
      .get('/ping')
      .expect(200, 'pong', done);
  });

  it('should return OK on health', (done) => {
    request(app)
      .get('/health')
      .expect(200, 'OK', done);
  });

  it('should return 404 on non existing page', (done) => {
    request(app)
      .get('/a')
      .expect(404, 'text', done);
  });

  it('should return 403 when no read permissions', (done) => {
    sinon.stub(acl, 'can').returns({
      readAny: () => ({ granted: false }),
    });
    request(app)
      .get('/')
      .expect(403, done);
  });
});
