const express = require("express");
const {
  registerUser,
  loginUser,
  forgetUser,
  resetPassword,
  getUsers,
  updateProfile,
} = require("../controllers/userController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// **User Authentication Routes**
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgetUser);
router.post("/reset-password", resetPassword);
router.put("/update-profile", authenticate(), updateProfile);

router.get("/all-users", authenticate(), authorizeAdmin(), getUsers);

module.exports = router;
