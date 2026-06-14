const admin = require("firebase-admin");

// 🔐 INIT FIREBASE (safe)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    console.log("🔥 Webhook reçu:", JSON.stringify(body, null, 2));

    // =========================
    // 1. Vérification paiement
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
    // 2. EMAIL CLIENT (robuste)
    // =========================
    const email =
      body?.customer?.email ||
      body?.data?.customer?.email ||
      body?.transaction?.customer?.email ||
      body?.payment_request?.customer?.email;

    // =========================
    // 3. MONTANT (important fallback plan)
    // =========================
    const amount =
      body?.amount ||
      body?.data?.amount ||
      body?.transaction?.amount ||
      0;

    // =========================
    // 4. PLAN (priorité + fallback)
    // =========================
    let plan =
      body?.metadata?.plan ||
      body?.data?.metadata?.plan ||
      body?.plan;

    // 🔥 fallback intelligent si metadata absent
    if (!plan) {
      if (amount == 50000) plan = "VIP";
      else if (amount == 100000) plan = "VVIP";
      else if (amount == 300000) plan = "VVVIP";
      else plan = "UNKNOWN";
    }

    console.log("👤 Email:", email);
    console.log("💳 Amount:", amount);
    console.log("📦 Plan:", plan);

    // =========================
    // 5. sécurité email obligatoire
    // =========================
    if (!email) {
      console.log("❌ Email introuvable dans webhook");
      return { statusCode: 200, body: "no email" };
    }

    // =========================
    // 6. FIND USER
    // =========================
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      console.log("❌ User introuvable:", email);
      return { statusCode: 200, body: "user not found" };
    }

    // =========================
    // 7. ACTIVER ACCÈS
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

    console.log("✅ ACCÈS ACTIVÉ:", email, plan);

    return {
      statusCode: 200,
      body: "success",
    };

  } catch (error) {
    console.error("❌ Webhook error:", error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
