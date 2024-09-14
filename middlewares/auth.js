const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  try {

    const { authorization } = req.headers;


    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(UNAUTHORIZED).json({ message: "Authorization required." });
    }


    const token = authorization.replace("Bearer ", "");


    const payload = jwt.verify(token, JWT_SECRET);


    req.user = payload;


    next();
  } catch (error) {

    return res.status(UNAUTHORIZED).json({ message: "Invalid or expired token." });
  }
};

module.exports = auth;