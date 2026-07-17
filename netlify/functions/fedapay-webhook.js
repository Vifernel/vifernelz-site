const admin = require("firebase-admin");
const { Webhook } = require("fedapay"); // npm install fedapay (si pas déjà fait)

// 🔐 INIT FIREBASE (safe)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

// 🔐 Secret du endpoint webhook — à récupérer dans
// FedaPay → Workbench → Webhooks → votre endpoint → "Cliquer pour révéler"
const ENDPOINT_SECRET = process.env.FEDAPAY_WEBHOOK_SECRET;

exports.handler = async (event) => {
  try {
    // =========================
    // 0. VERIFY SIGNATURE (NOUVEAU — sécurité)
    // =========================
    // Sans cette étape, n'importe qui connaissant l'URL du webhook
    // pourrait s'auto-attribuer un accès VIP/VVIP/VVVIP gratuitement
    // en envoyant une fausse requête. Cette vérification garantit que
    // la requête vient authentiquement de FedaPay.
    const signature =
      event.headers["x-fedapay-signature"] || event.headers["X-FEDAPAY-SIGNATURE"];

    if (!signature) {
      console.log("❌ Requête sans signature — rejetée");
      return { statusCode: 400, body: "missing signature" };
    }

    if (!ENDPOINT_SECRET) {
      console.error("❌ FEDAPAY_WEBHOOK_SECRET non configuré côté serveur");
      return { statusCode: 500, body: "server misconfigured" };
    }

    try {
      // On utilise event.body BRUT (pas encore parsé) pour la vérification,
      // comme l'exige le calcul de signature.
      Webhook.constructEvent(event.body, signature, ENDPOINT_SECRET);
    } catch (sigErr) {
      console.error("❌ Signature FedaPay invalide :", sigErr.message);
      return { statusCode: 400, body: `invalid signature: ${sigErr.message}` };
    }

    // =========================
    // À partir d'ici, la requête est authentifiée — logique inchangée
    // =========================
    const body = JSON.parse(event.body);

    console.log("🔥 WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

    // =========================
    // 1. VERIFY PAYMENT STATUS
    // =========================
    const isApproved =
      body?.status === "approved" ||
      body?.event === "transaction.approved" ||
      body?.event === "payment_request.approved";

    if (!isApproved) {
      return { statusCode: 200, body: "ignored" };
    }

    const db = admin.firestore();

    // =========================
    // 2. EMAIL EXTRACTION (ROBUST)
    // =========================
    const email =
      body?.customer?.email ||
      body?.data?.customer?.email ||
      body?.transaction?.customer?.email ||
      body?.payment_request?.customer?.email;

    // =========================
    // 3. AMOUNT EXTRACTION
    // =========================
    const amount =
      body?.amount ||
      body?.data?.amount ||
      body?.transaction?.amount ||
      body?.payment_request?.amount ||
      0;

    // =========================
    // 4. PLAN DETECTION (SMART LOGIC)
    // =========================
    let plan =
      body?.metadata?.plan ||
      body?.data?.metadata?.plan ||
      body?.plan;

    // 🔥 fallback ultra fiable
    if (!plan) {
      if (Number(amount) === 50000) plan = "VIP";
      else if (Number(amount) === 100000) plan = "VVIP";
      else if (Number(amount) === 300000) plan = "VVVIP";
      else plan = "UNKNOWN";
    }

    console.log("👤 EMAIL:", email);
    console.log("💳 AMOUNT:", amount);
    console.log("📦 PLAN:", plan);

    // =========================
    // 5. SECURITY CHECK
    // =========================
    if (!email) {
      console.log("❌ Missing email in webhook");
      return { statusCode: 200, body: "no email" };
    }

    // =========================
    // 6. FIND USER
    // =========================
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      console.log("❌ User not found:", email);
      return { statusCode: 200, body: "user not found" };
    }

    // =========================
    // 7. UPDATE USER ACCESS
    // =========================
    snapshot.forEach((doc) => {
      doc.ref.update({
        paid: true,
        plan: plan,
        amount: amount,
        access: true,
        paidAt: new Date().toISOString(),
      });
    });

    console.log("✅ ACCESS GRANTED:", email, plan);

    return {
      statusCode: 200,
      body: "success",
    };

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
