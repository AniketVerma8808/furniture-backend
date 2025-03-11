const Newsletter = require("../models/newsletterModel");

// Toggle Subscription (Subscribe/Unsubscribe)
exports.toggleSubscription = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      await Newsletter.deleteOne({ email });
      return res
        .status(200)
        .json({ message: "Unsubscribed successfully", isSubscribed: false });
    } else {
      await Newsletter.create({ email });
      return res
        .status(200)
        .json({ message: "Subscribed successfully", isSubscribed: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Manually Subscribe to Newsletter
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res
      .status(201)
      .json({ message: "Subscribed successfully", subscriber: newSubscriber });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
