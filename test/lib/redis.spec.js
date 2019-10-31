const assert = require('assert').strict;
const redis = require('../../lib/redis');

describe('Redis library', () => {
  context('Default connection', () => {
    it('should be exported by module', () => {
      assert(redis.driver);
    });

    it('should be disconnected', () => {
      assert.equal(redis.isConnected, false);
    });

    it('should allow to create new connections', () => {
      const con = redis.createNew();
      assert(con.driver);
    });
  });

  context('Disconnect', () => {
    it('should disconnect if connected', async () => {
      redis.connection = { disconnect: () => {} };
      redis.client = {};
      redis.db = {};
      assert.equal(redis.isConnected, true);
      await redis.disconnect();
      assert.equal(redis.isConnected, false);
    });

    it('should not try to disconnect if already disconnected', async () => {
      redis.db = 'db';
      await redis.disconnect();
      assert.equal(redis.db, 'db');
    });
  });
});
