const assert = require('assert').strict;
const mongodb = require('../../lib/mongodb');

describe('MongoDB library', () => {
  context('Default connection', () => {
    it('should be exported by module', () => {
      assert(mongodb.driver);
      assert(mongodb.client);
    });

    it('should be disconnected', () => {
      assert.equal(mongodb.isConnected, false);
    });

    it('should allow to create new connections', () => {
      const con = mongodb.createNew();
      assert(con.driver);
      assert(con.client);
    });
  });

  context('Disconnect', () => {
    it('should disconnect if connected', async () => {
      mongodb.connection = { close: () => {} };
      mongodb.db = {};
      assert.equal(mongodb.isConnected, true);
      await mongodb.disconnect();
      assert.equal(mongodb.isConnected, false);
    });

    it('should not try to disconnect if already disconnected', async () => {
      mongodb.db = 'db';
      await mongodb.disconnect();
      assert.equal(mongodb.db, 'db');
    });
  });
});
