import express from "express";
import productController from "../controller/productControllers";
import { authenticate } from "../middlewares/authMiddleware";
import productValidator from "../validations/productValidator";

const router = express.Router();

router.get("/products", productController.getAllProducts);

// Apply validation middleware here
router.post("/products", authenticate, productValidator.addOrEditProduct, productController.addProduct);

router.put("/products/:id", authenticate, productValidator.addOrEditProduct, productController.editProduct);

router.delete("/products/:id", authenticate, productController.deleteProduct);

router.post("/products/:id/like", authenticate, productController.likeProduct);
router.post("/products/:id/unlike", authenticate, productController.unlikeProduct);


export default router;
