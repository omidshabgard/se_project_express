const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/Config");
const UnauthorizedError = require("../utils/UnauthorizedError");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization required.");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    // You can log these for debugging, but make sure to remove in production
    console.log("Token:", token);
    console.log("Payload:", payload);

    req.user = payload;

    return next();
  } catch (error) {
    // Log the error for better debugging
    console.error(error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new UnauthorizedError("Invalid or expired token."));
    }

    return next(error);
  }
};

module.exports = auth;
