const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/Config");
const UnauthorizedError = require("../utils/UnauthorizedError");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if authorization header exists and follows the Bearer scheme
    if (!authorization || !authorization.startsWith("Bearer ")) {
      console.log("No authorization token or incorrect format.");
      throw new UnauthorizedError("Authorization required.");
    }

    // Extract the token by removing "Bearer "
    const token = authorization.replace("Bearer ", "");

    // Verify the token and decode the payload
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully, payload:", payload);

    // Attach user information from the token to the request object
    req.user = payload;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Authentication error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token."));
    }
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token has expired."));
    }

    // Pass any other errors to the next error handler
    return next(error);
  }
};

module.exports = auth;
