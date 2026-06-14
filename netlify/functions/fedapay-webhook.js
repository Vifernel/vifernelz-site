const admin = require("firebase-admin");

// init Firebase Admin
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

    console.log("Webhook reçu:", body);

    const eventType =
      body.event ||
      body.type ||
      body.status;

    // ✅ paiement confirmé
    if (eventType === "transaction.approved") {

      const email =
        body?.data?.customer?.email ||
        body?.customer?.email;

      if (!email) {
        console.log("Email introuvable");
        return { statusCode: 200, body: "NO EMAIL" };
      }

      const db = admin.firestore();

      const snapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      snapshot.forEach((doc) => {
        doc.ref.update({
          paid: true,
          paidAt: new Date().toISOString(),
        });
      });

      console.log("Paiement activé pour:", email);
    }

    return {
      statusCode: 200,
      body: "OK",
    };

  } catch (error) {
    console.error("Webhook error:", error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
