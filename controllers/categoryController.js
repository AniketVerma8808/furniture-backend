const categoryModel = require("../models/categoryModel");
const subcategoryModel = require("../models/subcategoryModel");

// **Create a new category**
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = new categoryModel({ name });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// **Get all categories**
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });

    if (!categories.length) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }

    res.json({ success: true, data: categories });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// **Delete a category**
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await subcategoryModel.deleteMany({ category: id });
    await categoryModel.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Category and its subcategories deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
