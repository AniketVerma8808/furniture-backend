const CartModel = require("../models/CartModel");

/**
 * Send standardized error response
 */
const handleError = (res, error) => {
  console.error(error);
  res
    .status(500)
    .json({ success: false, message: error.message || "Server Error" });
};

/**
 * Utility to find item index in cart by product and custom config
 */
const findItemIndex = (items, productId, custom) =>
  items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.custom) === JSON.stringify(custom)
  );

/**
 * ✅ Add item to cart
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, custom = null } = req.body;

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }

    const itemIndex = findItemIndex(cart.items, productId, custom);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, custom });
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * ✅ Get current user's cart
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await CartModel.findOne({ user: userId }).populate(
      "items.product"
    );

    res.json({ success: true, data: cart?.items || [] });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * ✅ Update quantity for a cart item
 */
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, custom = null, quantity } = req.body;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = findItemIndex(cart.items, productId, custom);
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, message: "Quantity updated successfully", cart });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * ✅ Remove item from cart
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { custom = null } = req.body;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = findItemIndex(cart.items, productId, custom);
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    handleError(res, error);
  }
};
