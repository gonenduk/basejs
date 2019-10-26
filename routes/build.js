function build(router, path, handlers) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(handlers)) {
    if (typeof value === 'function') {
      // key is method, value is middleware
      router[key](path, value);
    } else {
      // key is sub path, value is sub handlers
      build(router, `${path}/${key}`, value);
    }
  }
}

module.exports = build;
