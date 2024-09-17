const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

// Uncommented the getUsers route

// Commented out the unused routes
// router.post("/", createUser);
// router.get("/:id", getUser);

module.exports = router;
