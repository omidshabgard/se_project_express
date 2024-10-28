const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/Config");
const UnauthorizedError = require("../utils/UnauthorizedError");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      console.log("No authorization token or incorrect format.");
      throw new UnauthorizedError("Authorization required.");
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully, payload:", payload);

    req.user = payload;

    return next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token."));
    }
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token has expired."));
    }

    return next(error);
  }
};

module.exports = auth;
