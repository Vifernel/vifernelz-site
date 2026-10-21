exports.handler = async (event) => {
  try {
    const { amount, plan, phone, email, uid } = JSON.parse(event.body);

    const response = await fetch(process.env.MONEYFUSION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalPrice: amount,
        article: [{ [`Formation ${plan}`]: amount }],
        numeroSend: phone,
        nomclient: email.split("@")[0],
        personal_Info: [{ userId: uid, plan: plan }],
        return_url: "https://vifernelz.com/validation.html",
        webhook_url: "https://vifernelz.com/.netlify/functions/moneyfusion-webhook",
      }),
    });

    const data = await response.json();

    if (data.statut) {
      return { statusCode: 200, body: JSON.stringify({ url: data.url }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: data.message }) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
