const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Ensure all required fields are present
    if (!email || !password || !name || !avatar) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while creating a user.`
    );
    if (error.code === 11000) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "User with this email already exists." });
    }
    if (error.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data provided for user creation." });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while logging in.`
    );
    if (error.name === "UnauthorizedError") {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Incorrect email or password." });
    }

    if (error.message === "User not found.") {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    if (error.message === "Invalid password.") {
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while fetching users.`
    );
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).orFail(() => {
      const error = new Error("User not found.");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while fetching a user.`
    );

    if (error.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid user ID format." });
    }
    if (error.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data provided for user update." });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};
module.exports = {
  createUser,
  getUsers,
  getUser,
  login,
  getCurrentUser,
};
