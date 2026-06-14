const admin = require("firebase-admin");

// init Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    )
  });
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    console.log("Webhook reçu:", body);

    // paiement validé
    if (body.status === "approved") {

      const email = body?.customer?.email;
      const amount = body?.amount;

      let plan = null;

      // 🧠 DÉTECTION DU PLAN
      if (amount == 50000) plan = "VIP";
      if (amount == 100000) plan = "VVIP";
      if (amount == 300000) plan = "VVVIP";

      if (!email || !plan) {
        return {
          statusCode: 200,
          body: "missing data"
        };
      }

      const db = admin.firestore();

      const usersRef = db.collection("users");

      const snapshot = await usersRef.where("email", "==", email).get();

      snapshot.forEach(doc => {
        doc.ref.update({
          paid: true,
          plan: plan,
          paidAt: new Date().toISOString()
        });
      });

      console.log("Utilisateur mis à jour:", email, plan);
    }

    return {
      statusCode: 200,
      body: "OK"
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.message
    };
  }
};
