import express from "express";
import upload from "../middlewares/upload";
import productController from "../controller/productControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/products", productController.getAllProducts);
router.post("/products", authenticate, upload.single("image"), productController.addProduct);
router.put("/products/:id", authenticate, upload.single("image"), productController.editProduct);
router.delete("/products/:id", authenticate, productController.deleteProduct);
router.post("/products/:id/like", authenticate, productController.likeProduct);
router.post("/products/:id/unlike", authenticate, productController.unlikeProduct);

export default router;
