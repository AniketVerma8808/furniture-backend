const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
} = require("../controllers/blogController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const upload = require("../common/multer");

const router = express.Router();

router.post(
  "/create",
  authenticate(),
  authorizeAdmin(),
  upload.single("image"),
  createBlog
);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", authenticate(), authorizeAdmin(), deleteBlog);

module.exports = router;
