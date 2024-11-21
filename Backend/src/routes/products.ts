import express from "express";
import productController from "../controller/productControllers";

const router = express.Router();

router.get("/products", productController.getAllProducts);

// Route to create a product
router.post("/products", productController.createProduct);

// Route to update a product
router.patch("/products/:id", productController.patchProduct);

// Route to delete a product
router.delete("/products/:id", productController.deleteProduct);

export default router;
