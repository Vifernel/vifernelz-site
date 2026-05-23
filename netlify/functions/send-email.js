exports.handler = async (event) => {
  try {

    console.log("RAW BODY:", event.body);

    let data = {};

    // SAFE PARSING (IMPORTANT)
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      const params = new URLSearchParams(event.body);
      data = {
        name: params.get("name"),
        email: params.get("email"),
        subject: params.get("subject"),
        message: params.get("message")
      };
    }

    console.log("PARSED DATA:", data);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "VifernelZ",
          email: "contact@vifernelz.com"
        },
        to: [{ email: "contact@vifernelz.com" }],
        subject: data.subject || "Nouveau message site",
        htmlContent: `
          <h3>Nouveau message</h3>
          <p><b>Nom:</b> ${data.name}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Message:</b><br>${data.message}</p>
        `
      })
    });

    const result = await response.text();

    console.log("BREVO RESULT:", result);

    if (!response.ok) {
      throw new Error(result);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email envoyé",
        brevo: result
      })
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
