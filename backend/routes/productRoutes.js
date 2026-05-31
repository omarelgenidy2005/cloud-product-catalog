const express = require("express");
const multer = require("multer");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.patch("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;