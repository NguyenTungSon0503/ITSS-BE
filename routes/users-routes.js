import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import authenticateToken from "../middleware/authorization.js";
import jwtTokens from "../utils/jwt-helpers.js";

let refreshTokens = [];

const router = express.Router();
router.use(express.json());

/* GET users listing. */
// su dung access token de lay du lieu
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log(req.cookies);
    const users = await pool.query("SELECT * FROM users");
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// dang ky user, tra ve token
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",
      [req.body.name, req.body.email, hashedPassword]
    );
    res.json(jwtTokens(newUser.rows[0]));
  } catch (error) {
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
