const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticate(), authorizeAdmin(), createCategory); // Create Category
router.get("/all", authenticate(), authorizeAdmin(), getCategories); // Get All Categories
router.delete("/delete/:id", authenticate(), authorizeAdmin(), deleteCategory); // Delete Category + Subcategories

module.exports = router;
