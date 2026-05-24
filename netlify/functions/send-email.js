exports.handler = async (event) => {
  try {

    const params = new URLSearchParams(event.body);

    const name = params.get("name");
    const email = params.get("email");
    const subject = params.get("subject");
    const message = params.get("message");

    // =========================
    // 1️⃣ EMAIL ADMIN (TOI)
    // =========================
    const adminResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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

    const adminResult = await adminResponse.text();

    // =========================
    // 2️⃣ AUTO EMAIL CLIENT
    // =========================
    const clientResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "VifernelZ",
          email: "contact@vifernelz.com"
        },
        to: [
          {
            email: email
          }
        ],
        subject: "Merci pour votre message - VifernelZ",
        htmlContent: `
          <div style="font-family:Arial;padding:20px;">
            <div style="text-align:center;">
              <img src="https://vifernelz.com/images/44D0E6A3-D26B-4797-9088-91885C732E69.png"
              style="height:90px;">
            </div>

            <h2>Merci ${name} 🙌</h2>

            <p>Nous avons bien reçu votre message.</p>

            <p>Notre équipe vous répondra sous 24h.</p>

            <hr>

            <p><b>Votre message :</b></p>
            <p>${message}</p>

            <br>
            <p>— VifernelZ Team</p>
          </div>
        `
      })
    });

    const clientResult = await clientResponse.text();

    // =========================
    // 3️⃣ RETURN DEBUG
    // =========================
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Emails sent via Brevo",
        admin: adminResult,
        client: clientResult
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
