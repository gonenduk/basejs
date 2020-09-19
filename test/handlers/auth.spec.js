const assert = require('assert').strict;
const sinon = require('sinon');
const Boom = require('@hapi/boom');
const user = require('../../models/user');
const jwt = require('../../lib/jwt');
const social = require('../../lib/social');
const { auth } = require('../../handlers');

const req = {};
const res = {};

describe.skip('Handler of /auth', () => {
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
    before(() => {
      req.body = { username: 'user', password: 'password' };
    });

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
      signAccessTokenStub.resolves('ta');
      signRefreshTokenStub.resolves('tr');
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
    before(() => {
      req.user = { id: '1' };
      res.status = () => res;
      res.end = () => res;
      logoutStub.resolves();
    });

    it('should always succeed', async () => {
      await assert.doesNotReject(() => auth.token.delete(req, res));
    });
  });

  context('Create access and refresh tokens from refresh token', () => {
    before(() => {
      req.body = { token: 't' };
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

  context('Create access and refresh tokens from social token', () => {
    before(() => {
      req.body = { provider: 'p', token: 't' };
    });

    it('should fail on unknown provider', async () => {
      verifyTokenStub.rejects(Error('e'));
      await assert.rejects(() => auth.social.token.post(req, res), Boom.unauthorized('Unsupported provider \'p\''));
    });

    it('should fail if token not valid by provider', async () => {
      req.body.provider = 'facebook';
      verifyTokenStub.resolves({ id: '1' });
      validateWithProviderStub.rejects(Error());
      await assert.rejects(() => auth.social.token.post(req, res), Boom.unauthorized('Unauthorized'));
    });

    it('should fail if user in token not found', async () => {
      validateWithProviderStub.resolves({});
      getOneStub.resolves();
      await assert.rejects(() => auth.social.token.post(req, res), Boom.unauthorized('No matching user found'));
    });

    it('should return access and refresh tokens on success', async () => {
      getOneStub.resolves({});
      res.json = (obj) => {
        assert.deepEqual(obj, { access_token: 'ta', refresh_token: 'tr' });
      };
      await assert.doesNotReject(() => auth.social.token.post(req, res));
    });
  });
});
