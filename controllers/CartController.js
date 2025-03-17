const CartModel = require("../models/CartModel");

/**
 * Standard error handler
 */
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error.message || "Server Error",
  });
};

/**
 * Helper to safely compare `custom` configs
 */
const compareCustom = (a, b) => {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
};

/**
 * Utility to find cart item index
 */
const findItemIndex = (items, productId, custom) =>
  items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      compareCustom(item.custom, custom)
  );

/**
 * ✅ Add to Cart
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
 * ✅ Get Cart
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
 * ✅ Update Quantity
 */

exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, custom = null, quantity = 1, type = "set" } = req.body;

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

    const item = cart.items[itemIndex];
    const qty = Number(quantity);

    if (type === "increase") {
      item.quantity += qty;
    } else if (type === "decrease") {
      item.quantity -= qty;
      if (item.quantity <= 0) {
        cart.items.splice(itemIndex, 1); // remove item
      }
    } else {
      // default is set quantity directly
      if (qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        item.quantity = qty;
      }
    }

    await cart.save();

    res.json({
      success: true,
      message:
        type === "set" ? "Quantity updated" : `Quantity ${type}d successfully`,
      cart,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * ✅ Remove from Cart
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
