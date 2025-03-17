const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/WishlistController");

const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate(), addToWishlist);

router.get("/", authenticate(), getWishlist);

router.delete("/:productId", authenticate(), removeFromWishlist);

module.exports = router;
