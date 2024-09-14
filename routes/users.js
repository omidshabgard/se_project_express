const router = require("express").Router();
const {
  createUser,
  login,
  getUsers,
  getUser,
  getCurrentUser,
} = require("../controllers/users");
// router.post("/signin", login);
// router.post("/signup", createUser);
router.get("/me", getCurrentUser);

// router.post("/", createUser);
// router.get("/", getUsers);
// router.get("/:id", getUser);

module.exports = router;
