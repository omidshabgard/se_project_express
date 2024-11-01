const NODE_ENV = "development";
const JWT_SECRET =
  NODE_ENV === "production"
    ? "your_production_secret_key"
    : "your_development_secret_key";

module.exports = {
  JWT_SECRET,
};
