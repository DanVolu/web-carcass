import express from "express";
import cartController from "../controller/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// Add to cart
router.post("/cart/add", authenticate, cartController.addToCart);

// Remove from cart
router.delete("/remove/:productId", authenticate, cartController.removeFromCart);

// Clear cart
router.delete("/clear", authenticate, cartController.clearCart);

// Get cart details
router.get("/", authenticate, cartController.getCart);

export default router;
