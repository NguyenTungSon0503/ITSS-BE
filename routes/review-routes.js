import express from "express";
import {
    getReviewPartner,
    getReviewUser
} from "../controllers/reviewController.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();
router.use(express.json());


router.get("/user", authenticateToken, getReviewUser);

router.get("/partner", authenticateToken, getReviewPartner);


export default router;
