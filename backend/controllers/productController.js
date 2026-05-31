const { v4: uuidv4 } = require("uuid");

const productService = require("../services/productService");
const { uploadImageToS3, getImageUrl } = require("../services/s3Service");

async function createProduct(req, res) {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "name, description, price, and category are required"
      });
    }

    const productId = uuidv4();
    let imageKey = null;
    let imageUrl = null;
    let imageVersions = [];

    if (req.file) {
      imageKey = `products/${productId}/${Date.now()}-${req.file.originalname}`;
      await uploadImageToS3(req.file, imageKey);
      imageUrl = getImageUrl(imageKey);

      imageVersions.push({
        key: imageKey,
        url: imageUrl,
        uploadedAt: new Date().toISOString()
      });
    }

    const product = {
      productId,
      name,
      description,
      price: Number(price),
      category,
      imageKey,
      imageUrl,
      imageVersions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedProduct = await productService.createProduct(product);

    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product"
    });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get products error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get products"
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product"
    });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const existingProduct = await productService.getProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    if (updates.price) {
      updates.price = Number(updates.price);
    }

    if (req.file) {
      const imageKey = `products/${productId}/${Date.now()}-${req.file.originalname}`;
      await uploadImageToS3(req.file, imageKey);

      const imageUrl = getImageUrl(imageKey);

      updates.imageKey = imageKey;
      updates.imageUrl = imageUrl;
      updates.imageVersions = [
        ...(existingProduct.imageVersions || []),
        {
          key: imageKey,
          url: imageUrl,
          uploadedAt: new Date().toISOString()
        }
      ];
    }

    const updatedProduct = await productService.updateProduct(productId, updates);

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product"
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};