const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
  addToCart,
  updateQuantity,
  removeFromCart,
  getCart,
} = require("../controllers/CartController");
const router = express.Router();

router.post("/", authenticate(), addToCart); // Add to cart
router.put("/updatequantity", authenticate(), updateQuantity); // Decrease quantity
router.delete("/remove/:productId", authenticate(), removeFromCart); // Remove product from cart
router.get("/", authenticate(), getCart); // Get cart details

module.exports = router;
