const express = require("express");
const { createIssue, getAllIssues } = require("../controllers/issueController");
const router = express.Router();

router.post("/", createIssue);
router.get("/", getAllIssues);

module.exports = router;
