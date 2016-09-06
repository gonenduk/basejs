const app = require('../../app');
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({ service: config.email.service }, config.email);

// Promisify
const render = Promise.promisify(app.render, { context: app });
const sendMail = Promise.promisify(transporter.sendMail, { context: transporter });

// Send email
function send(options, data) {
  // Defaults
  options = options || {};
  data = data || {};
  options.template = options.template || config.email.template;

  // Render template into html
  return render('emails/' + options.template, data).then((html) => {
    options.html = html;

    // Send email
    return sendMail(options);
  });
}

module.exports = { send };
