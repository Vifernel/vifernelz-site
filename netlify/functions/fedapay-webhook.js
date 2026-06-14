const admin = require("firebase-admin");

// 🔐 init Firebase Admin (une seule fois)
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

    console.log("🔥 Webhook reçu:", body);

    // ✅ Vérification paiement
    const isApproved =
      body.status === "approved" ||
      body.event === "transaction.approved" ||
      body.event === "payment_request.approved";

    if (!isApproved) {
      return {
        statusCode: 200,
        body: "ignored",
      };
    }

    const db = admin.firestore();

    // 📧 email client (clé principale)
    const email = body?.customer?.email;

    // 💳 PLAN (très important)
    let plan =
      body?.metadata?.plan ||
      body?.plan ||
      body?.payment?.metadata?.plan ||
      "UNKNOWN";

    console.log("👤 Email:", email);
    console.log("📦 Plan:", plan);

    if (!email) {
      return {
        statusCode: 200,
        body: "no email",
      };
    }

    // 🔍 chercher user par email
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      console.log("❌ User introuvable");
      return {
        statusCode: 200,
        body: "user not found",
      };
    }

    // 🔥 ACTIVER ACCÈS
    snapshot.forEach((doc) => {
      doc.ref.update({
        paid: true,
        plan: plan,
        access: true,
        paidAt: new Date().toISOString(),
      });
    });

    console.log("✅ Accès activé pour:", email);

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
