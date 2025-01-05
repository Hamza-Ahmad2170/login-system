import { Router } from "express";
import {
  login,
  refreshTokenHandler,
  register,
} from "../controller/user.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokenHandler);

router.get("/protected", verifyJWT, (req, res) => {
  res.json("protected route");
});

export default router;
