import express from "express";
const router = express.Router();
import { registerUser,loginUser,logoutUser } from "./controllers/user.controller.js";
import { Request, Response } from "express";

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);

export default router;
