const router = require("express").Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

// Route for creating a clothing item with validation
router.post("/", validateClothingItem, createItem);

// Route for deleting an item by ID with validation
router.delete("/:id", validateId, deleteItem);

// Route for liking an item by ID with validation
router.put("/:id/likes", validateId, likeItem);

// Route for disliking an item by ID with validation
router.delete("/:id/likes", validateId, dislikeItem);

module.exports = router;
