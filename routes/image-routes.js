import express from "express";
import {
  getUserImage,
  createUserImage,
} from "../controllers/imageController.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();
router.use(express.json());

//if wanna domain is /api/images/get then add /get behind
router.get("/", authenticateToken, getUserImage);

router.post("/", authenticateToken, createUserImage);

export default router;
