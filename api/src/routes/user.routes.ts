import { Router } from "express";
import {
  login,
  refreshTokenHandler,
  register,
} from "../controller/user.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshTokenHandler);

export default router;
