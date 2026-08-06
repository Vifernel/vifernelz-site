// netlify/functions/get-videos.js
//
// Renvoie la liste des vidéos de formation autorisées pour l'utilisateur,
// en vérifiant son identité et son plan CÔTÉ SERVEUR — les IDs vidéo des
// niveaux non payés ne sont jamais envoyés au navigateur.
//
// ============================================================
// MISE EN PLACE
// ============================================================
// Réutilise exactement les mêmes variables d'environnement Netlify
// que fedapay-webhook.js : FIREBASE_SERVICE_ACCOUNT (le JSON du compte
// de service Firebase). Rien de plus à configurer si le webhook
// fonctionne déjà.
// ============================================================

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

/* ============================================================
   CATALOGUE DES VIDÉOS — déplacé ici depuis dashboard.html.
   💡 Pour ajouter une vidéo, ajoutez simplement son ID YouTube
   dans le tableau du bon niveau. dashboard.html n'a plus besoin
   d'être modifié pour ça.
============================================================ */
const TIERS = {
  VIP: {
    level: 1,
    icon: "📘",
    label: "Formation Trading VIP",
    videos: [
      "7EQC5n0mVYk","sXyYPjuCo20","hE-J-rlPdjk","ECpmx1agKto","0IFb-dUK0-o",
      "r7grkqzHH54","ZUeOO15zH5o","CmNR5EssrH8","Ml_rDRv-BYg","vhjQ5-V9msI",
      "jdQbfNWbOpg","5VH0BAI4Zo0","zNYwV-UTOyU","p-Ag-UURGxM","-a1A321DDD4",
      "NtHp3UZowMw","18BRgaDmDqw","MBhVskb9lPo","lwVI0QIiQnw"
    ]
  },
  VVIP: {
    level: 2,
    icon: "📗",
    label: "Formation Trading VVIP",
    videos: [
      "36y7iGNb3Fk","8ZTYPkQA2m8","2ZswvhrncnQ","SOYE007iHoM","HAmXyGjmYs0",
      "qu-eYJp7CB8","2JOae7AYVXE","TO5MqmNMYVI","uhPvZw2Ob5w","aPDH0VFDOXE",
      "DThUmWfqk04","-rvBTY6t53E","WYOLLQzF-4w","UDZRYwXFAwE"
    ]
  },
  VVVIP: {
    level: 3,
    icon: "📕",
    label: "Formation VVVIP (Accès complet)",
    videos: [
      "Hab15xXkW0Q","ZUzimoTe9Mw","c1Qm4kRoOrA","zQv-zmWKISU","AaMKrQp9Jb4",
      "379RGr5h-Kg","VOW2QL_Sw2I","fScHHN_U94Y","jjmuUKjgdhs","4AA-xX_5y6g",
      "SMP1Kk200aA","GEOh-zCOaRU","AdIvQIw33b0","guUTCQGWtuw","BtbRMccMH2Q",
      "vltP3zNx1-Y","-MWNfmM0ibY","SKQCklzHKdw","08BpAG8sicY","35oeApGVnDU",
      "X7LthnKAMh8","EhsyEa_nMa8","f3OB7161mPM","PpxDa-3p3qo","k7x-V-VmEfo",
      "plWXM9M6n_Q","exjPUYwNYAQ","ljPAw9fZw2M","GOoKVAGG_xM","5-a97FPQWvc",
      "JjDCjVCg0AU"
    ]
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // =========================
    // 1. VÉRIFIER LE JETON FIREBASE
    // =========================
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { statusCode: 401, body: JSON.stringify({ error: "missing token" }) };
    }

    const idToken = authHeader.replace("Bearer ", "");
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      console.error("❌ Jeton invalide:", err.message);
      return { statusCode: 401, body: JSON.stringify({ error: "invalid token" }) };
    }

    const uid = decodedToken.uid;

    // =========================
    // 2. RÉCUPÉRER LE PLAN RÉEL (Firestore, côté serveur)
    // =========================
    const db = admin.firestore();
    const snap = await db.collection("users").doc(uid).get();

    if (!snap.exists) {
      return { statusCode: 200, body: JSON.stringify({ paid: false, plan: null, tiers: {} }) };
    }

    const data = snap.data();
    const userLevel = TIERS[data.plan]?.level || 0;

    if (!data.paid || userLevel === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ paid: false, plan: data.plan || null, tiers: {} })
      };
    }

    // =========================
    // 3. NE RENVOYER QUE LES NIVEAUX AUTORISÉS
    // =========================
    const allowedTiers = {};
    Object.keys(TIERS).forEach((key) => {
      if (TIERS[key].level <= userLevel) {
        allowedTiers[key] = TIERS[key];
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paid: true, plan: data.plan, tiers: allowedTiers })
    };

  } catch (error) {
    console.error("❌ get-videos error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
