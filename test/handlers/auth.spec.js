/* eslint no-unused-vars: "off" */
const request = require('supertest');
const express = require('express');
require('express-async-errors');
const sinon = require('sinon');
const user = require('../../models/user');
const jwt = require('../../lib/jwt');
const social = require('../../lib/social');
const router = require('../../handlers');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = { id: 1 };
  next();
});
app.use(router);
app.use((req, res) => {
  res.end();
});
app.use((err, req, res, next) => {
  res.status(err.output.statusCode).end();
});

describe('Handler of /auth', () => {
  let getOneStub;
  let getOneByIdStub;
  let validatePasswordStub;
  let logoutStub;
  let signAccessTokenStub;
  let signRefreshTokenStub;
  let verifyTokenStub;
  let validateWithProviderStub;

  before(() => {
    getOneStub = sinon.stub(user, 'getOne');
    getOneByIdStub = sinon.stub(user, 'getOneById');
    validatePasswordStub = sinon.stub(user, 'validatePassword');
    logoutStub = sinon.stub(user, 'logout');
    signAccessTokenStub = sinon.stub(jwt, 'signAccessToken');
    signRefreshTokenStub = sinon.stub(jwt, 'signRefreshToken');
    verifyTokenStub = sinon.stub(jwt, 'verifyToken');
    validateWithProviderStub = sinon.stub(social, 'validateWithProvider');
  });

  after(() => {
    sinon.restore();
  });

  context('Create access and refresh tokens from username and password', () => {
    // before(() => {
    //   req.body = { username: 'user', password: 'password' };
    // });

    it('should fail on invalid user', (done) => {
      request(app)
        .post('/auth/token')
        .send({ username: 'user', password: 'password' })
        .expect(401, done);
    });

    it('should fail on invalid password', (done) => {
      getOneStub.resolves({});
      request(app)
        .post('/auth/token')
        .send({ username: 'user', password: 'password' })
        .expect(401, done);
    });

    it('should return access and refresh tokens on success', (done) => {
      getOneStub.resolves({});
      validatePasswordStub.resolves(true);
      signAccessTokenStub.resolves('ta');
      signRefreshTokenStub.resolves('tr');
      request(app)
        .post('/auth/token')
        .send({ username: 'user', password: 'password' })
        .expect(200, { access_token: 'ta', refresh_token: 'tr' }, done);
    });

    it('should fail if cannot create tokens', (done) => {
      signAccessTokenStub.rejects(Error('e'));
      request(app)
        .post('/auth/token')
        .send({ username: 'user', password: 'password' })
        .expect(401, done);
    });
  });

  context('Delete token', () => {
    before(() => {
      // req.user = { id: '1' };

      logoutStub.resolves();
    });

    it('should always succeed', (done) => {
      request(app)
        .delete('/auth/token')
        .expect(204, done);
    });
  });

  context('Create access and refresh tokens from refresh token', () => {
    it('should fail on invalid token', (done) => {
      verifyTokenStub.rejects(Error('e'));
      request(app)
        .post('/auth/refresh/token')
        .send({ token: 't' })
        .expect(401, done);
    });

    it('should fail on invalid user in token', (done) => {
      verifyTokenStub.resolves({ id: '1' });
      getOneByIdStub.resolves();
      request(app)
        .post('/auth/refresh/token')
        .send({ token: 't' })
        .expect(401, done);
    });

    it('should fail after logout', (done) => {
      verifyTokenStub.resolves({ id: '1', iat: 1 });
      getOneByIdStub.resolves({ logoutAt: new Date() });
      request(app)
        .post('/auth/refresh/token')
        .send({ token: 't' })
        .expect(401, done);
    });

    it('should return access and refresh tokens on success', (done) => {
      verifyTokenStub.resolves({ id: '1', iat: Date.now() * 2 });
      getOneByIdStub.resolves({ logoutAt: new Date() });
      signAccessTokenStub.resolves('ta');
      request(app)
        .post('/auth/refresh/token')
        .send({ token: 't' })
        .expect(200, { access_token: 'ta', refresh_token: 'tr' }, done);
    });
  });

  context('Create access and refresh tokens from social token', () => {
    it('should fail on unknown provider', (done) => {
      verifyTokenStub.rejects(Error('e'));
      request(app)
        .post('/auth/social/token')
        .send({ provider: 'p', token: 't' })
        .expect(401, done);
    });

    it('should fail if token not valid by provider', (done) => {
      verifyTokenStub.resolves({ id: '1' });
      validateWithProviderStub.rejects(Error());
      request(app)
        .post('/auth/social/token')
        .send({ provider: 'facebook', token: 't' })
        .expect(401, done);
    });

    it('should fail if user in token not found', (done) => {
      validateWithProviderStub.resolves({});
      getOneStub.resolves();
      request(app)
        .post('/auth/social/token')
        .send({ provider: 'facebook', token: 't' })
        .expect(401, done);
    });

    it('should return access and refresh tokens on success', (done) => {
      getOneStub.resolves({});
      request(app)
        .post('/auth/social/token')
        .send({ provider: 'facebook', token: 't' })
        .expect(200, { access_token: 'ta', refresh_token: 'tr' }, done);
    });
  });
});
