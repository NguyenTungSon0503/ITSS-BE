import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import authenticateToken from "../middleware/authorization.js";
import jwtTokens from "../utils/jwt-helpers.js";
import jwt from "jsonwebtoken";
import decodedToken from "../middleware/decode.js";
let refreshTokens = [];

const router = express.Router();
router.use(express.json());

/* GET users listing. */
// su dung access token de lay du lieu
router.get("/", authenticateToken, async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    res.json({ users: userInfo });
    // console.log(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// dang ky user, tra ve token
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (user_name,user_email,user_password,user_role) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.body.name, req.body.email, hashedPassword, req.body.role]
    );
    res.json(jwtTokens(newUser.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// xoa toan bo users
router.delete("/", async (req, res) => {
  try {
    const users = await pool.query("DELETE FROM users");
    res.status(204).json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
