import express from "express";
import cartController from "../controller/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// Add to cart
router.post("/cart/add", authenticate, cartController.addToCart);

// Decrease item quantity in cart
router.patch("/cart/decrease", authenticate, cartController.decreaseQuantity);

// Remove from cart
router.delete("/cart/remove/:productId", authenticate, cartController.removeFromCart);

// Clear cart
router.delete("/cart/clear", authenticate, cartController.clearCart);

// Get cart details
router.get("/cart", authenticate, cartController.getCart);

export default router;
