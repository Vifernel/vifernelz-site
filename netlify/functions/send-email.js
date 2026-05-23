exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "NETLIFY FUNCTION WORKS"
    })
  };
};
