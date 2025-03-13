const categoryModel = require("../models/categoryModel");
const subcategoryModel = require("../models/subcategoryModel");

// **Create a new subcategory**
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Both name and category are required",
      });
    }

    // Check if category exists
    const existingCategory = await categoryModel.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if subcategory with the same name already exists under the category
    const existingSubcategory = await subcategoryModel.findOne({
      name,
      category,
    });

    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists under this category",
      });
    }

    // Create and save subcategory
    const subcategory = new subcategoryModel({ name, category });
    await subcategory.save();

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: subcategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// **Get all subcategories**
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await subcategoryModel
      .find()
      .populate("category", "name");

    res.json({
      success: true,
      data: subcategories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// **Delete a subcategory**
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await subcategoryModel.findByIdAndDelete(id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
