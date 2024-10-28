const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/customErrors"); // Use your custom error class

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      // Throw an UnauthorizedError instead of returning the response directly
      throw new UnauthorizedError("Authorization required.");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    // If there’s an issue with the token, throw an UnauthorizedError
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Invalid or expired token."));
    }

    // For any other errors, pass it along to the error handler
    return next(error);
  }
};

module.exports = auth;
