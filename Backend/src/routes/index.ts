import express from "express";
import usersRoutes from "./users"; // Import user-related routes
import authRoutes from "./auth"; // Import authentication-related routes
import productRoutes from "./products";
import loggerMiddleware from "../middlewares/loggerMiddleware"; // Logger middleware (optional)


const router = express.Router();

// Apply loggerMiddleware to the users and auth routes (if needed)
router.use("/users", loggerMiddleware, usersRoutes);
router.use("/auth", loggerMiddleware, authRoutes);
router.use("/products", loggerMiddleware, productRoutes);

export default router;
