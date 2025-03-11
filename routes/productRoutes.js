const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const upload = require("../common/multer");

const router = express.Router();

router.get("/", getAllProducts);

router.post(
  "/",
  authenticate(),
  authorizeAdmin(),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "customImages", maxCount: 1 },
  ]),
  createProduct
);

router.patch(
  "/:id",
  authenticate(),
  authorizeAdmin(),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "customImages", maxCount: 1 },
  ]),
  updateProduct
);

router.delete("/:id", authenticate(), authorizeAdmin(), deleteProduct);

module.exports = router;
