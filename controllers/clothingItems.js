const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    if (!name || !weather || !imageUrl) {
      return res.status(BAD_REQUEST).json({
        message: "Missing required fields: name, weather, and imageUrl.",
      });
    }

    const item = await clothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while creating an item.`
    );

    if (error.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data provided for item creation." });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await clothingItem.find();
    return res.status(200).json(items);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while fetching items.`
    );
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await clothingItem.findByIdAndDelete(id).orFail(() => {
      const error = new Error("Item not found.");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).json(item);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while deleting an item.`
    );
    if (error.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid item ID format." });
    }
    if (error.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .orFail(() => {
        const error = new Error("Item not found.");
        error.statusCode = NOT_FOUND;
        throw error;
      });

    return res.status(200).json(item);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while liking an item.`
    );
    if (error.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid item ID format." });
    }
    if (error.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .orFail(() => {
        const error = new Error("Item not found.");
        error.statusCode = NOT_FOUND;
        throw error;
      });

    return res.status(200).json(item); // Ensure return is present here
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while disliking an item.`
    );
    if (error.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid item ID format." });
    }
    if (error.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
