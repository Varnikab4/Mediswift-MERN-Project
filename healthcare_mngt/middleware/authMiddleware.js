const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Auth Failed",
          success: false,
        });
      } else {
        // Add userId to request body
        req.body.userId = decode.id;

        // New part: Store the full decoded user object in request
        req.user = decode;

        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};
