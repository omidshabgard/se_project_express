const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/Config");
const User = require("../models/user");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");
const UnauthorizedError = require("../utils/UnauthorizedError");

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password || !name || !avatar) {
      throw new BadRequestError("All fields are required.");
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
      return next(new ConflictError("User with this email already exists."));
    }
    if (error.name === "ValidationError") {
      return next(
        new BadRequestError("Invalid data provided for user creation.")
      );
    }
    return next(error); // Let the error handler handle other types of errors
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Email and password are required.");
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while logging in.`
    );

    if (error.message === "User not found.") {
      return next(new UnauthorizedError(error.message));
    }
    if (error.message === "Invalid password.") {
      return next(new UnauthorizedError(error.message));
    }
    return next(error); // Let the error handler handle other types of errors
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    return res.status(200).json(user);
  } catch (error) {
    return next(error); // Let the error handler handle other types of errors
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const id = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return next(new NotFoundError("User not found"));
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(
        new BadRequestError("Invalid data provided for user update.")
      );
    }
    return next(error); // Let the error handler handle other types of errors
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
