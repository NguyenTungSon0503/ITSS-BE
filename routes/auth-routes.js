import express from "express";
import {
  login,
  refreshToken,
  deleteRefreshToken,
} from "../controllers/authController.js";

const router = express.Router();
router.use(express.json());

router.post("/login", login);

router.get("/refresh_token", refreshToken);

router.delete("/refresh_token", deleteRefreshToken);

export default router;
