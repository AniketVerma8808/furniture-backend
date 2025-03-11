const express = require("express");
const {
  toggleSubscription,
  getAllSubscribers,
  subscribeNewsletter,
} = require("../controllers/newsletterController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

// Subscribe to Newsletter (Public)
router.post("/newsletter", subscribeNewsletter);

// Toggle Subscription (Login Required)
router.patch("/toggle-subscribe", authenticate(), toggleSubscription);

// Get All Subscribers (Admin Only)
router.get("/newsletter", authenticate(), authorizeAdmin(), getAllSubscribers);

module.exports = router;
