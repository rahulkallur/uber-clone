import express from "express";
const router = express.Router();
import { registerUser } from "./controllers/user.controller.js";
import { Request, Response } from "express";

router.post("/register",registerUser);

export default router;
