import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  profileController,
} from "./controllers/userController.js";

import { userAuth } from "./middlewares/authMiddleware.js";
export const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.get("/profile", userAuth, profileController);
