import express from "express";
import authenticateToken from "../middleware/authorization.js";
import { createContract, getContractUser } from "../controllers/contractController.js";

const router = express.Router();
router.use(express.json());


router.post("/", authenticateToken, createContract);

router.get("/user", authenticateToken, getContractUser);


export default router;
