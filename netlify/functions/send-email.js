exports.handler = async (event) => {
  try {

    // =========================
    // 0️⃣ VÉRIFICATION MÉTHODE
    // =========================
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    const params = new URLSearchParams(event.body || "");

    const name = params.get("name")?.trim();
    const email = params.get("email")?.trim();
    const subject = params.get("subject")?.trim();
    const message = params.get("message")?.trim();

    // Token Cloudflare Turnstile
    const turnstileToken = params.get("cf-turnstile-response");

    // =========================
    // 1️⃣ VALIDATION DES CHAMPS
    // =========================
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: "Veuillez remplir les champs obligatoires."
      };
    }

    // =========================
    // 2️⃣ VÉRIFICATION TURNSTILE
    // =========================
    if (!turnstileToken) {
      return {
        statusCode: 403,
        body: "Vérification anti-spam manquante."
      };
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken
        })
      }
    );

    const turnstileResult = await turnstileResponse.json();

    // Si Cloudflare refuse → ON N'ENVOIE AUCUN EMAIL
    if (!turnstileResult.success) {
      console.error(
        "Turnstile validation failed:",
        turnstileResult["error-codes"]
      );

      return {
        statusCode: 403,
        body: "Vérification anti-spam échouée."
      };
    }

    // =========================
    // 3️⃣ EMAIL ADMIN (TOI)
    // =========================
    const adminResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
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
      }
    );

    // Vérification Brevo
    if (!adminResponse.ok) {
      const adminError = await adminResponse.text();

      console.error(
        "Brevo admin email error:",
        adminError
      );

      throw new Error("Erreur lors de l'envoi de l'email.");
    }

    // =========================
    // 4️⃣ AUTO EMAIL CLIENT
    // =========================
    const clientResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
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
            <div style="
              font-family:Arial;
              background:#0b0f1a;
              color:#ffffff;
              padding:30px;
              border-radius:12px;
            ">

              <div style="text-align:center;">

                <img
                  src="https://vifernelz.com/images/44D0E6A3-D26B-4797-9088-91885C732E69.png"
                  style="height:90px;margin-bottom:20px;"
                >

              </div>

              <h2 style="color:#8ab4ff;">
                Merci ${name} 🙌
              </h2>

              <p style="color:#e5e7eb;">
                Nous avons bien reçu votre message.
              </p>

              <p style="color:#cbd5e1;">
                Notre équipe vous répondra sous 24h.
              </p>

              <hr style="
                border:1px solid #1f2a44;
                margin:20px 0;
              ">

              <div style="
                background:#111827;
                padding:15px;
                border-radius:10px;
              ">

                <p style="color:#8ab4ff;">
                  <b>Votre message :</b>
                </p>

                <p style="color:#ffffff;">
                  ${message}
                </p>

              </div>

              <br>

              <p style="color:#94a3b8;">
                — VifernelZ Team
              </p>

            </div>
          `
        })
      }
    );

    // Vérification Brevo
    if (!clientResponse.ok) {
      const clientError = await clientResponse.text();

      console.error(
        "Brevo client email error:",
        clientError
      );

      // L'email admin est déjà parti.
      // On ne considère donc pas toute la demande comme échouée.
    }

    // =========================
    // 5️⃣ REDIRECTION SUCCÈS
    // =========================
    return {
      statusCode: 302,
      headers: {
        Location: "/?success=true"
      }
    };

  } catch (error) {

    console.error("send-email error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Une erreur est survenue."
      })
    };
  }
};
