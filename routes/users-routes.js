import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import authenticateToken from "../middleware/authorization.js";
import jwtTokens from "../utils/jwt-helpers.js";
import jwt from "jsonwebtoken";
let refreshTokens = [];

const router = express.Router();
router.use(express.json());

/* GET users listing. */
// su dung access token de lay du lieu
router.get("/", authenticateToken, async (req, res) => {
  try {
    //decode
    const accessToken = req.cookies.accessToken;
    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user_email = decodedToken.user_email;
      console.log(user_email);
      const user_info = await pool.query("SELECT * FROM users WHERE user_email = $1", [user_email]);
      console.log(user_info.rows)
      res.json({ users: user_info.rows });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// dang ky user, tra ve token
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (user_name,user_email,user_password,user_role) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.body.name, req.body.email, hashedPassword, req.body.role]
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
