module.exports = {
  home: (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip === '::1') ip = '127.0.0.1';
    res.render('index', { ip });
  },

  ping: (req, res) => {
    res.send('pong');
  },
};
