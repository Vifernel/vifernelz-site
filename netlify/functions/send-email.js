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
        templateId: 1,
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
          name,
          email,
          subject,
          message
        }
      })
    });

    // =========================
    // 2️⃣ AUTO EMAIL CLIENT (DARK MODE)
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
          <div style="font-family:Arial;background:#0b0f1a;color:#ffffff;padding:30px;border-radius:12px;">

            <div style="text-align:center;">
              <img src="https://vifernelz.com/images/44D0E6A3-D26B-4797-9088-91885C732E69.png"
              style="height:90px;margin-bottom:20px;">
            </div>

            <h2 style="color:#8ab4ff;">Merci ${name} 🙌</h2>

            <p style="color:#e5e7eb;">
              Nous avons bien reçu votre message.
            </p>

            <p style="color:#cbd5e1;">
              Notre équipe vous répondra sous 24h.
            </p>

            <hr style="border:1px solid #1f2a44;margin:20px 0;">

            <div style="background:#111827;padding:15px;border-radius:10px;">
              <p style="color:#8ab4ff;"><b>Votre message :</b></p>
              <p style="color:#ffffff;">${message}</p>
            </div>

            <br>

            <p style="color:#94a3b8;">— VifernelZ Team</p>

          </div>
        `
      })
    });

    // =========================
    // 3️⃣ RETURN CLEAN (PLUS DE JSON AFFICHÉ)
    // =========================
    return {
      statusCode: 302,
      headers: {
        Location: "/?success=true"
      }
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
