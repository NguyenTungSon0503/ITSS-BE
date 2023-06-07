import express from "express";
import {
  getAllInvitations,
  createInvitation,
  getInvitationsTest,
  getInvitations,
} from "../controllers/offerController.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();
router.use(express.json());

//if wanna domain is /api/images/get then add /get behind
router.get("/all_offers", authenticateToken, getAllInvitations);

// Insert data when client sends request
router.post("/", authenticateToken, createInvitation);

// API format: group invitations by user
router.get("/partner_offer", authenticateToken, getInvitationsTest);

// API format: each invitation has its own userInfo
router.get("/invitations", authenticateToken, getInvitations);

export default router;
