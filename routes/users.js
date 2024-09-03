const express = require("express");
const { createUser, getUsers, getUser } = require("../controllers/users");
const router = express.Router();
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);

module.exports = router;
