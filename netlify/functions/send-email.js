exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.body);

    const data = {
      name: params.get("name") || "",
      email: params.get("email") || "",
      subject: params.get("subject") || "",
      message: params.get("message") || ""
    };

    console.log("📩 FORM DATA RECEIVED:", data);
    console.log("🔑 BREVO KEY EXISTS:", !!process.env.BREVO_API_KEY);

    // =========================
    // EMAIL ADMIN
    // =========================
    const adminResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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

    const adminText = await adminResponse.text();

    if (!adminResponse.ok) {
      console.error("❌ BREVO ADMIN ERROR:", adminText);
      throw new Error("Brevo admin failed");
    }

    // =========================
    // AUTO EMAIL CLIENT
    // =========================
    const clientResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
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

    const clientText = await clientResponse.text();

    if (!clientResponse.ok) {
      console.error("❌ BREVO CLIENT ERROR:", clientText);
      throw new Error("Brevo client failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Emails envoyés avec succès"
      })
    };

  } catch (error) {
    console.error("🔥 FUNCTION ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
