const assert = require('assert').strict;
const sinon = require('sinon');
const Boom = require('@hapi/boom');
const user = require('../../models/user');
const jwt = require('../../lib/jwt');
const { auth } = require('../../handlers');

const req = {};
const res = {};

describe('Handler of /auth', () => {
  const getOneStub = sinon.stub(user, 'getOne');
  const validatePasswordStub = sinon.stub(user, 'validatePassword');
  const signAccessTokenStub = sinon.stub(jwt, 'signAccessToken').resolves('ta');
  const signRefreshTokenStub = sinon.stub(jwt, 'signRefreshToken').resolves('tr');

  after(() => {
    getOneStub.restore();
    validatePasswordStub.restore();
    signAccessTokenStub.restore();
    signRefreshTokenStub.restore();
  });

  context('Create access and refresh tokens from username and password', () => {
    req.body = { username: 'user', password: 'password' };

    it('should fail on invalid user', async () => {
      await assert.rejects(() => auth.token.post(req, res), Boom.unauthorized('Incorrect username or password'));
    });

    it('should fail on invalid password', async () => {
      getOneStub.resolves({});
      await assert.rejects(() => auth.token.post(req, res), Boom.unauthorized('Incorrect username or password'));
    });

    it('should return access and refresh tokens on success', async () => {
      getOneStub.resolves({});
      validatePasswordStub.resolves(true);
      res.json = (obj) => {
        assert.deepEqual(obj, { access_token: 'ta', refresh_token: 'tr' });
      };
      await assert.doesNotReject(() => auth.token.post(req, res));
    });

    it('should fail if cannot create tokens', async () => {
      res.json = () => res;
      signAccessTokenStub.rejects(Error('e'));
      await assert.rejects(() => auth.token.post(req, res), Boom.unauthorized('Failed to sign user tokens: e'));
    });
  });

  context('Delete token', () => {
    req.user = { id: '1' };
    res.status = () => res;
    res.end = () => res;
    const logoutStub = sinon.stub(user, 'logout').resolves();

    after(() => {
      logoutStub.restore();
    });

    it('should always succeed', async () => {
      await assert.doesNotReject(() => auth.token.delete(req, res));
    });
  });

  context('Create access and refresh tokens from refresh token', () => {
    req.body = { token: 't' };
    const getOneByIdStub = sinon.stub(user, 'getOneById');
    const verifyTokenStub = sinon.stub(jwt, 'verifyToken');

    after(() => {
      getOneByIdStub.restore();
      verifyTokenStub.restore();
    });

    it('should fail on invalid token', async () => {
      verifyTokenStub.rejects(Error('e'));
      await assert.rejects(() => auth.refresh.token.post(req, res), Boom.unauthorized('Invalid refresh token: e'));
    });

    it('should fail on invalid user in token', async () => {
      verifyTokenStub.resolves({ id: '1' });
      getOneByIdStub.resolves();
      await assert.rejects(() => auth.refresh.token.post(req, res), Boom.unauthorized('Invalid user in refresh token'));
    });

    it('should fail after logout', async () => {
      verifyTokenStub.resolves({ id: '1', iat: 1 });
      getOneByIdStub.resolves({ logoutAt: new Date() });
      await assert.rejects(() => auth.refresh.token.post(req, res), Boom.unauthorized('Refresh token expired'));
    });

    it('should return access and refresh tokens on success', async () => {
      verifyTokenStub.resolves({ id: '1', iat: Date.now() * 2 });
      getOneByIdStub.resolves({ logoutAt: new Date() });
      signAccessTokenStub.resolves('ta');
      res.json = (obj) => {
        assert.deepEqual(obj, { access_token: 'ta', refresh_token: 'tr' });
      };
      await assert.doesNotReject(() => auth.refresh.token.post(req, res));
    });
  });
});
