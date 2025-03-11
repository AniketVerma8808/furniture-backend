const AddressModel = require("../models/AddressModel");
const userModel = require("../models/userModel");

// Create Address
exports.createAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      city,
      phone,
      pincode,
      company,
      gstNumber,
    } = req.body;
    const userId = req.user.id;

    const newAddress = new AddressModel({
      user: userId,
      firstName,
      lastName,
      address,
      city,
      phone,
      pincode,
      company,
      gstNumber,
    });
    await newAddress.save();

    await userModel.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });

    res
      .status(201)
      .json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Addresses
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await AddressModel.find({ user: userId });

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const updates = req.body;
    // console.log(updates);
    const updatedAddress = await AddressModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await AddressModel.findById(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await AddressModel.findByIdAndDelete(id);
    await userModel.findByIdAndUpdate(address.user, {
      $pull: { addresses: id },
    });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
