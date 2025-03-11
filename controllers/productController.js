const Product = require("../models/ProductModel");

// Utility function for error response
const handleError = (res, error) => {
  res.status(500).json({ success: false, message: error.message });
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category subcategory");
    res.json({ success: true, data: products });
  } catch (error) {
    handleError(res, error);
  }
};

// Create New Product
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Handle normal images
    if (req.files?.images) {
      productData.images = req.files["images"].map(
        (file) => `${process.env.SERVER_URL}/uploads/${file.filename}`
      );
    }

    // Handle custom images
    if (req.body.isCustomized === "true" && req.files?.customImages) {
      productData.custom = req.files["customImages"].map((file) => ({
        image: `${process.env.SERVER_URL}/uploads/${file.filename}`,
      }));
    } else {
      productData.custom = [];
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    await newProduct.populate("category subcategory");

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    handleError(res, error);
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const updatedFields = { ...req.body };

    // Update normal images
    if (req.files?.images) {
      updatedFields.images = req.files["images"].map(
        (file) => `${process.env.SERVER_URL}/uploads/${file.filename}`
      );
    }

    // Update custom images
    if (req.body.isCustomized === "true" && req.files?.customImages) {
      updatedFields.custom = req.files["customImages"].map((file) => ({
        image: `${process.env.SERVER_URL}/uploads/${file.filename}`,
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    ).populate("category subcategory");

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
