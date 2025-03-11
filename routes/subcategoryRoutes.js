const express = require("express");
const {
  createSubcategory,
  getSubcategories,
  deleteSubcategory,
} = require("../controllers/subcategoryController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create Subcategory
router.post("/create", authenticate(), authorizeAdmin(), createSubcategory);

// Get All Subcategories
router.get("/all", getSubcategories);

// Delete Subcategory
router.delete(
  "/delete/:id",
  authenticate(),
  authorizeAdmin(),
  deleteSubcategory
);

module.exports = router;
