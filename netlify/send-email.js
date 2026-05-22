const nodemailer = require("nodemailer");

exports.handler = async (event) => {

  const data = JSON.parse(event.body);

  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "ac17b8001@smtp-brevo.com",
      pass: "TA_SMTP_KEY_ICI"
    }
  });

  // EMAIL POUR TOI
  await transporter.sendMail({
    from: "VifernelZ Website <contact@vifernelz.com>",
    to: "contact@vifernelz.com",
    subject: data.subject,
    text: `
Nom: ${data.name}
Email: ${data.email}
Message: ${data.message}
    `
  });

  // AUTO-RÉPONSE CLIENT
  await transporter.sendMail({
    from: "VifernelZ Academy <contact@vifernelz.com>",
    to: data.email,
    subject: "Merci pour votre message",
    text: "Bonjour, merci pour votre message. Nous vous répondrons sous 24h."
  });

  return {
    statusCode: 200,
    body: "OK"
  };
};
