import express from "express";
import {
  getUsers,
  createUser,
  deleteUsers,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();
router.use(express.json());

/* GET users listing. */
router.get("/", authenticateToken, getUsers);

// dang ky user, tra ve token
router.post("/", createUser);

// xoa toan bo users
router.delete("/", deleteUsers);

export default router;
