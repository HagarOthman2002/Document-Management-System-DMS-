import express from "express";
import { authenticateMiddleWare } from "../utilities";
import { register, login, getUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateMiddleWare, getUser);

export default router;
