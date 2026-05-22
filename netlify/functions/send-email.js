exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": "TA_BREVO_API_KEY_ICI",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "VifernelZ",
        email: "contact@vifernelz.com"
      },
      to: [
        {
          email: "contact@vifernelz.com"
        }
      ],
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
      "api-key": "TA_BREVO_API_KEY_ICI",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "VifernelZ Academy",
        email: "contact@vifernelz.com"
      },
      to: [
        {
          email: data.email
        }
      ],
      subject: "Merci pour votre message",
      htmlContent: `
        <h2>Merci ${data.name}</h2>
        <p>Nous avons bien reçu ton message.</p>
        <p>Notre équipe te répond sous 24h.</p>
        <br>
        <p>— VifernelZ Academy</p>
      `
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "OK" })
  };
};
