const clothingItem = require("../models/clothingItem");

const createItem = async (req, res) => {
  try {
    const item = await clothingItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await clothingItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await clothingItem.findByIdAndDelete(id);
    if (item) {
      return res.status(200).json(item);
    } else {
      res.status(404).send("Item not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await clothingItem.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).send({ message: "Item not found"});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await clothingItem.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).send("Item not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
