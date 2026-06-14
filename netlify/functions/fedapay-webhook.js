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
