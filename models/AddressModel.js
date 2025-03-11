const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{6}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
    company: { type: String },
    gstNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
