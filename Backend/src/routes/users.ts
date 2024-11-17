import express from "express";
import userControllers from "../controller/userController";

const router = express.Router();

router.get("/users", userControllers.getUsers);
router.get("/user/:identifier", userControllers.getUser);
router.put("/user/:identifier/add-admin", userControllers.addAdmin);
router.put("/user/:identifier/remove-admin", userControllers.removeAdmin);
router.get("/admins", userControllers.getAdmins);

export default router;
