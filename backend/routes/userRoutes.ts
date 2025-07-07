import express from "express";
import { authenticateToken } from "../utilities";
import { register, login, getUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateToken, getUser);

export default router;
