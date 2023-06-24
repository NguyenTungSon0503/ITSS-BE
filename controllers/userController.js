import pool from "../db.js";
import bcrypt from "bcrypt";
import jwtTokens from "../utils/jwt-helpers.js";
import decodedToken from "../middleware/decode.js";

const getUsers = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    res.json({ users: userInfo });
    // console.log(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING *",
      [req.body.email, hashedPassword, req.body.role]
    );
    res.json(jwtTokens(newUser.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const users = await pool.query("DELETE FROM users");
    res.status(204).json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const userInfo = await decodedToken(accessToken);
  const user_id = userInfo.id;
  const { name, nation, location, sex, age, bio } = req.body;
  try {
    const updatedUser = await pool.query(
      "UPDATE users SET name=$1, nation=$2, location=$3, sex=$4, age=$5, bio=$6 WHERE id=$7 RETURNING *",
      [name, nation, location, sex, age, bio, user_id]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { getUsers, createUser, deleteUsers, updateProfile };
