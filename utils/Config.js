const { NODE_ENV } = process.env;
const JWT_SECRET =
  NODE_ENV === "production"
    ? process.env.JWT_SECRET
    : "your_development_secret_key";

module.exports = {
  JWT_SECRET,
};
