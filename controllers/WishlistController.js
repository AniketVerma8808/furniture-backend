const WishlistModel = require("../models/WishlistModel");

const handleError = (res, error) => {
  res.status(500).json({ success: false, message: error.message });
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Check if already in wishlist
    const exists = await WishlistModel.findOne({
      user: userId,
      product: productId,
    });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Already in wishlist" });
    }

    const wishlistItem = new WishlistModel({
      user: userId,
      product: productId,
    });
    await wishlistItem.save();

    res.status(201).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    handleError(res, error);
  }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await WishlistModel.find({ user: userId }).populate(
      "product"
    );
    res.json({ success: true, data: wishlist });
  } catch (error) {
    handleError(res, error);
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await WishlistModel.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Product not in wishlist" });
    }

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    handleError(res, error);
  }
};
