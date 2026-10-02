// Mettre à false une fois le problème réglé
const DEBUG = true;

const textResponse = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "text/plain; charset=utf-8" },
  body
});

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return textResponse(405, "Method Not Allowed");
    }

    const params = new URLSearchParams(event.body || "");

    const name = params.get("name")?.trim();
    const email = params.get("email")?.trim();
    const subject = params.get("subject")?.trim();
    const message = params.get("message")?.trim();
    const turnstileToken = params.get("cf-turnstile-response");

    if (!name || !email || !message) {
      return textResponse(400, "Veuillez remplir les champs obligatoires.");
    }

    if (!turnstileToken) {
      return textResponse(403, "Vérification anti-spam manquante.");
    }

    // ===== TURNSTILE =====
    const secret = (process.env.TURNSTILE_SECRET_KEY || "").trim();

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: turnstileToken })
      }
    );

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error("Turnstile failed:", turnstileResult["error-codes"]);

      if (DEBUG) {
        return textResponse(
          403,
          "DEBUG anti-spam\n" +
            "codes: " + JSON.stringify(turnstileResult["error-codes"]) + "\n" +
            "secret présente: " + (secret ? "oui" : "NON") + "\n" +
            "longueur secret: " + secret.length + "\n" +
            "début secret: " + secret.slice(0, 4) + "\n" +
            "hostname: " + (turnstileResult.hostname || "n/a")
        );
      }
      return textResponse(403, "Vérification anti-spam échouée.");
    }

    // ===== EMAIL ADMIN =====
    const adminResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        templateId: 1,
        sender: { name: "VifernelZ", email: "contact@vifernelz.com" },
        to: [{ email: "contact@vifernelz.com" }],
        replyTo: { email, name },
        params: { name, email, subject, message }
      })
    });

    if (!adminResponse.ok) {
      const adminError = await adminResponse.text();
      console.error("Brevo admin email error:", adminError);
      if (DEBUG) {
        return textResponse(500, "DEBUG Brevo admin: " + adminError);
      }
      throw new Error("Erreur lors de l'envoi de l'email.");
    }

    // ===== AUTO-RÉPONSE CLIENT =====
    const safeName = escapeHtml(name);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const clientResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        sender: { name: "VifernelZ", email: "contact@vifernelz.com" },
        to: [{ email }],
        subject: "Merci pour votre message - VifernelZ",
        htmlContent: `
          <div style="font-family:Arial;background:#0b0f1a;color:#ffffff;padding:30px;border-radius:12px;">
            <div style="text-align:center;">
              <img src="https://vifernelz.com/images/44D0E6A3-D26B-4797-9088-91885C732E69.png"
                   style="height:90px;margin-bottom:20px;">
            </div>
            <h2 style="color:#8ab4ff;">Merci ${safeName} 🙌</h2>
            <p style="color:#e5e7eb;">Nous avons bien reçu votre message.</p>
            <p style="color:#cbd5e1;">Notre équipe vous répondra sous 24h.</p>
            <hr style="border:1px solid #1f2a44;margin:20px 0;">
            <div style="background:#111827;padding:15px;border-radius:10px;">
              <p style="color:#8ab4ff;"><b>Votre message :</b></p>
              <p style="color:#ffffff;">${safeMessage}</p>
            </div>
            <br>
            <p style="color:#94a3b8;">— VifernelZ Team</p>
          </div>
        `
      })
    });

    if (!clientResponse.ok) {
      console.error("Brevo client email error:", await clientResponse.text());
      // L'email admin est déjà parti : on ne fait pas échouer la demande.
    }

    return {
      statusCode: 302,
      headers: { Location: "/?success=true#contact" }
    };
  } catch (error) {
    console.error("send-email error:", error);
    return textResponse(
      500,
      DEBUG ? "DEBUG erreur: " + error.message : "Une erreur est survenue."
    );
  }
};
