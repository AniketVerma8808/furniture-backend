const express = require("express");
const {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const upload = require("../common/multer");
const {
  authorizeAdmin,
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create",
  authenticate(),
  authorizeAdmin(),
  upload.single("image"),
  createTestimonial
);
router.get("/all", getAllTestimonials);
router.delete("/:id", authenticate(), authorizeAdmin(), deleteTestimonial);

module.exports = router;
