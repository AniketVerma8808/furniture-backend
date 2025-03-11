const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    issueType: {
      type: String,
      enum: ["Contact Us", "Rent Your Property", "Franchise", "Complaints"],
      required: true,
    },
    issue: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
