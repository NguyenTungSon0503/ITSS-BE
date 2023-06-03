import express, { query } from "express";
import authenticateToken from "../middleware/authorization.js";
import decodedToken from "../middleware/decode.js";
import pool from "../db.js";

const router = express.Router();
router.use(express.json());

//if wanna domain is /api/images/get then add /get behind
router.get("/partner_offer", authenticateToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const userInfo = await decodedToken(accessToken);
  if (userInfo.user_role === "partner") {
    try {
      const getOfferInfo = await pool.query("SELECT * FROM offers")
      const offerInfo = getOfferInfo.rows
      console.log(offerInfo);
      res.send({offers: {offerInfo}});
    } catch (e) {
      console.log(e);
      res.status(500).json({ messege: e.message });
    }
  } else {
    res
      .status(401)
      .json({ messege: "You are not authorized to do this action" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const userInfo = await decodedToken(accessToken);
  if (userInfo.user_role === "user") {
    try {
      const newOffer = await pool.query(
        "INSERT INTO offers (inviter_id, start_time, end_time, date, sex, age, location, meal_price_range, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9) RETURNING *",
        [
          userInfo.id,
          req.body.hour_start,
          req.body.hour_end,
          req.body.date,
          req.body.sex,
          req.body.age,
          req.body.location,
          req.body.meal_price,
          req.body.note,
        ]
      );
      res.send(newOffer.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).json({ messege: e.message });
    }
  } else {
    res
      .status(401)
      .json({ messege: "You are not authorized to do this action" });
  }
});

export default router;
