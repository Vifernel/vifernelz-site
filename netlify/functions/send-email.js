exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // ENVOI EMAIL ADMIN
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "VifernelZ",
          email: "contact@vifernelz.com"
        },
        to: [{ email: "contact@vifernelz.com" }],
        subject: data.subject || "Nouveau message site VifernelZ",
        htmlContent: `
          <h3>Nouveau message</h3>
          <p><b>Nom:</b> ${data.name}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Message:</b><br>${data.message}</p>
        `
      })
    });

    // AUTO-RÉPONSE CLIENT
await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    "accept": "application/json",
    "api-key": process.env.BREVO_API_KEY,
    "content-type": "application/json"
  },
  body: JSON.stringify({
    sender: {
      name: "VifernelZ",
      email: "contact@vifernelz.com"
    },
    replyTo: {
      email: "contact@vifernelz.com",
      name: "VifernelZ"
    },
    to: [
      {
        email: data.email
      }
    ],
    subject: "Merci pour votre message",
    htmlContent: `
      <h2>Merci ${data.name}</h2>
      <p>Nous avons bien reçu votre message.</p>
      <p>Notre équipe vous répondra sous 24h.</p>
      <br>
      <p>— VifernelZ</p>
    `
  })
});

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
