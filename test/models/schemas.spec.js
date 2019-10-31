const assert = require('assert').strict;
const schemas = require('../../models/schemas');

describe('Schema of Models', () => {
  context('Get schemas', () => {
    it('should be defined for every model', () => {
      assert(schemas.users);
      assert(schemas.products);
    });
  });
});
