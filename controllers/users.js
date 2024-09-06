const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while creating a user.`
    );
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
      error.statusCode = NOT_FOUND; // Set custom status code
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
    } else if (error.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: error.message });
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
};
