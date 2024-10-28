const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getCurrentUser, updateUser } = require("../controllers/users");
const User = require("../models/user");
const {
  validateUserCreation,
  validateUserLogin,
} = require("../middlewares/validation");

const router = express.Router();

// Route for getting the current user
router.get("/me", getCurrentUser);

// Route for updating the user
router.patch("/me", updateUser);

// Route for user signup with validation
router.post("/signup", validateUserCreation, async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword, name });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Add return here to ensure the function always returns a value
  return res.status(201).json({ message: "User created", token });
});

// Route for user login with validation
router.post("/login", validateUserLogin, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Add return here to ensure the function always returns a value
  return res.status(200).json({ message: "Logged in", token });
});

module.exports = router;
