const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");

router.get("/users/me", getCurrentUser);

// Uncommented the getUsers route

// Commented out the unused routes
// router.post("/", createUser);
// router.get("/:id", getUser);

module.exports = router;
