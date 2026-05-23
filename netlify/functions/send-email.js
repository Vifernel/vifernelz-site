exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      keyExists: !!process.env.BREVO_API_KEY,
      keyValue: process.env.BREVO_API_KEY
        ? "FOUND"
        : "MISSING"
    })
  };
};
