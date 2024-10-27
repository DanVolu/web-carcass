import express from "express"; 
import authControllers from "../controller/authController";

const router = express.Router();

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.get("/status", authControllers.status);

export default router;
