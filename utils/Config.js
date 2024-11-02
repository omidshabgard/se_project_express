const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET =
  NODE_ENV === "production"
    ? process.env.JWT_SECRET
    : "your_development_secret_key";

module.exports = {
  JWT_SECRET,
};
