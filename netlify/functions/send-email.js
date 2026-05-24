exports.handler = async (event) => {
  try {

    const params = new URLSearchParams(event.body);

    const name = params.get("name");
    const email = params.get("email");
    const subject = params.get("subject");
    const message = params.get("message");

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        templateId: 1, // 👈 ton template Brevo
        sender: {
          name: "VifernelZ",
          email: "contact@vifernelz.com"
        },
        to: [
          {
            email: "contact@vifernelz.com"
          }
        ],
        replyTo: {
          email: email,
          name: name
        },
        params: {
          name: name,
          email: email,
          subject: subject,
          message: message
        }
      })
    });

    const result = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent via Brevo",
        brevo: result
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
