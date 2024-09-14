const router = require("express").Router();
const {
  createUser,
  login,
  getUsers,
  getUser,
  getCurrentUser,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/me", getCurrentUser);

// Commented out the unused routes
// router.post("/", createUser);
// router.get("/", getUsers);
// router.get("/:id", getUser);

module.exports = router;
