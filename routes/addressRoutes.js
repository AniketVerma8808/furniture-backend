const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const router = express.Router();

// Address routes
router.post("/", authenticate(), createAddress);
router.get("/", authenticate(), getAddresses);
router.patch("/:id", authenticate(), updateAddress);
router.delete("/:id", authenticate(), deleteAddress);

module.exports = router;
