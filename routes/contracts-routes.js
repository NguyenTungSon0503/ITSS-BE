import express from "express";
import authenticateToken from "../middleware/authorization.js";
import { createContract, getContractUser, getContractPartner, reviewUser } from "../controllers/contractController.js";

const router = express.Router();
router.use(express.json());


router.post("/", authenticateToken, createContract);

router.get("/user", authenticateToken, getContractUser);

router.get("/partner", authenticateToken, getContractPartner);

router.post("/review", authenticateToken, reviewUser);



export default router;
