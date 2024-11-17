import express from "express";
import authControllers from "../controller/authController";
import authenticate from "../middlewares/authenticate";  // Import the authentication middleware
import authValidator from "../validations/authValidator"; 

const router = express.Router();

router.post("/register", authValidator.register, authControllers.register);
router.post("/login", authValidator.login, authControllers.login);
router.post("/logout", authControllers.logout);
router.get("/me", authenticate, authControllers.me);

export default router;
