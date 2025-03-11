const express = require("express");

const upload = require("../common/multer");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const {
  createBanner,
  deleteBanner,
  getAllBanners,
} = require("../controllers/bannerController");
const router = express.Router();

// Create a banner (Admin only)
router.post(
  "/",
  authenticate(),
  authorizeAdmin(),
  upload.single("image"),
  createBanner
);

// Get all banners
router.get("/", getAllBanners);

// Delete a banner (Admin only)
router.delete("/:id", authenticate(), authorizeAdmin(), deleteBanner);

module.exports = router;
