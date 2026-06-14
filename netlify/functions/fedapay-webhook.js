const admin = require("firebase-admin");

// ⚠️ initialise Firebase Admin une seule fois
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

exports.handler = async (event) => {
  try {

    const body = JSON.parse(event.body);

    // ✅ paiement validé
    if (body.status === "approved") {

      const email = body?.customer?.email;

      const db = admin.firestore();

      const usersRef = db.collection("users");

      const snapshot = await usersRef.where("email", "==", email).get();

      snapshot.forEach(doc => {
        doc.ref.update({
          paid: true,
          paidAt: new Date().toISOString()
        });
      });

    }

    return {
      statusCode: 200,
      body: "OK"
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: error.message
    };
  }
};
