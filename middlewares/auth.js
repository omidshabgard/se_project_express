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

    req.user = payload;

    return next();
  } catch (error) {
    console.error("Auth error:", error);

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
