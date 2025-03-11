const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
} = require("../validation/validation");
const { sendMail } = require("../common/sendmail");
const userModel = require("../models/userModel");
const Newsletter = require("../models/newsletterModel");

// **User Registration**
const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  const { name, email, phone, password } = req.body;

  try {
    if (await userModel.findOne({ email }))
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    if (await userModel.findOne({ phone }))
      return res
        .status(400)
        .json({ success: false, message: "Phone already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    }); // FIXED: `User` -> `userModel`
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// **User Login**
const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const existingSubscriber = await Newsletter.findOne({ email });
    const isSubscribed = !!existingSubscriber;

    res.json({
      success: true,
      token,
      user: { ...user.toObject(), isSubscribed },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// **Forget Password**
const forgetUser = async (req, res) => {
  const { error } = emailSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email not registered" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendMail(
      user.email,
      "Password Reset Request",
      `Click to reset your password: ${resetUrl}`
    );

    res.json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// **Reset Password**
const resetPassword = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

// **Update User Profile**
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id; // Logged-in user ID

    // Find the existing user
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prevent role changes
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, phone, email }, // Role field is not included in the update
      { new: true, select: "name email phone _id role" }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// **Get All Users**
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("name phone email role");

    if (!users.length) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgetUser,
  resetPassword,
  getUsers,
  updateProfile,
};
