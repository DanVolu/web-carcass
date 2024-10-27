import express from "express";

import usersRoutes from "./users";
import authRoutes from "./auth";

import loggerMiddleware from "../middlewares/loggerMiddleware";

const router = express.Router();

router.use("/users", loggerMiddleware, usersRoutes);
router.use("/auth", loggerMiddleware, authRoutes);

export default router;
