const issueForm = require("../models/issueForm");

// Create new issue
exports.createIssue = async (req, res) => {
  try {
    const { name, email, phone, issueType, issue } = req.body;
    const newIssue = new issueForm({ name, email, phone, issueType, issue });
    await newIssue.save();
    res.status(201).json({ message: "Issue submitted successfully", newIssue });
  } catch (error) {
    res.status(500).json({ message: "Error submitting issue", error });
  }
};

// Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await issueForm.find();
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issues", error });
  }
};
