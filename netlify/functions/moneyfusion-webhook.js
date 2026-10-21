const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    console.log("🔥 MONEYFUSION WEBHOOK:", JSON.stringify(body, null, 2));

    if (body.event !== "payin.session.completed") {
      return { statusCode: 200, body: "ignored" };
    }

    const uid = body?.personal_Info?.[0]?.userId;
    const plan = body?.personal_Info?.[0]?.plan;
    const amount = body?.Montant;

    if (!uid) {
      console.log("❌ Missing uid in webhook");
      return { statusCode: 200, body: "no uid" };
    }

    const db = admin.firestore();
    await db.collection("users").doc(uid).update({
      paid: true,
      plan: plan,
      amount: amount,
      access: true,
      paidAt: new Date().toISOString(),
    });

    console.log("✅ ACCESS GRANTED:", uid, plan);
    return { statusCode: 200, body: "success" };
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return { statusCode: 500, body: error.message };
  }
};
