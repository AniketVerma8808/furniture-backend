const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    price: { type: Number, required: true },
    // colors: { type: [String], default: [] },
    images: { type: [String], default: [] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    newarrival: { type: Boolean, default: false },
    bestsellor: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    isCustomized: { type: Boolean, default: false },
    custom: [
      {
        image: String,
        price: Number,
        title: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
