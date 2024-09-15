const router = require("express").Router();
const {
  createUser,
  login,
  getUsers,
  // getUser,
  getCurrentUser,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/me", getCurrentUser);

// Uncommented the getUsers route
router.get("/", getUsers);

// Commented out the unused routes
// router.post("/", createUser);
// router.get("/:id", getUser);

module.exports = router;
