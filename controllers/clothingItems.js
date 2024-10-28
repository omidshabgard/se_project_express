const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const ForbiddenError = require("../utils/ForbiddenError");

const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;

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
      return next(
        new BadRequestError("Invalid data provided for item creation.")
      );
    }

    return next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const items = await clothingItem.find();
    return res.status(200).json(items);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while fetching items.`
    );
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await clothingItem.findById(id).orFail(() => {
      throw new NotFoundError("Item not found.");
    });

    if (item.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("You are not authorized to delete this item.");
    }

    await item.remove();

    return res.status(200).json({ message: "Item successfully deleted." });
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while deleting an item.`
    );
    if (error.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format."));
    }
    return next(error);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .orFail(() => {
        throw new NotFoundError("Item not found.");
      });

    return res.status(200).json(item);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while liking an item.`
    );
    if (error.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format."));
    }
    return next(error);
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const item = await clothingItem
      .findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .orFail(() => {
        throw new NotFoundError("Item not found.");
      });

    return res.status(200).json(item);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message '${error.message}' occurred while disliking an item.`
    );
    if (error.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format."));
    }
    return next(error);
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
