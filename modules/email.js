const app = require('../app');
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: config.smtp.service,
  auth: {
    user: config.smtp.username,
    pass: config.smtp.password
  }
});

// Send mail
function send(options, data) {
  // Defaults
  options = options || {};
  data = data || {};
  options.template = options.template || 'general';

  // Render template to html
  app.render('emails/' + options.template, data, (err, html) => {
    // Stop on render errors
    if (err) {
      logger.error(err);
      return err;
    }

    // Use rendered html
    options.html = html;

    // Send the email
    transporter.sendMail(options, (err, info) => {
      err ? logger.error(err) : logger.debug('Email sent: ' + info.response);
    });
  });
}

module.export = { send };
