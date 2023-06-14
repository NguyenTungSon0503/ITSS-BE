import express from "express";
import authenticateToken from "../middleware/authorization.js";
import { createRecommendation, getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();
router.use(express.json());

// Insert data when client sends request
router.post("/", authenticateToken, createRecommendation);

router.get("/", authenticateToken, getRecommendations);



export default router;
