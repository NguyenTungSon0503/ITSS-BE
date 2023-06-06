import express, { query } from "express";
import authenticateToken from "../middleware/authorization.js";
import decodedToken from "../middleware/decode.js";
import pool from "../db.js";

const router = express.Router();
router.use(express.json());

//if wanna domain is /api/images/get then add /get behind
router.get("/all_offers", authenticateToken, async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);

    if (userInfo.user_role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    const getInvitationsInfo = await pool.query("SELECT * FROM invitations");
    const invitationsInfo = getInvitationsInfo.rows;

    // console.log(InvitationsInfo);
    res.send({ invitations: invitationsInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);

    if (userInfo.user_role !== "user") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    const { hour_start, hour_end, date, sex, age, location, meal_price, note } =
      req.body;

    const newInvitation = await pool.query(
      "INSERT INTO invitations (invitation_sender_id, start_time, end_time, date, sex, age, location, meal_price_range, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [
        userInfo.id,
        hour_start,
        hour_end,
        date,
        sex,
        age,
        location,
        meal_price,
        note,
      ]
    );

    res.send(newInvitation.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/partner_offer", authenticateToken, async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);

    if (userInfo.user_role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    const getInvitationsInfo = await pool.query("SELECT * FROM invitations");
    const invitations = getInvitationsInfo.rows;
    const uniqueInvitationSenderIDs = [
      ...new Set(
        invitations.map((invitation) => invitation.invitation_sender_id)
      ),
    ];

    const responseData = [];

    for (const invitationSenderId of uniqueInvitationSenderIDs) {
      const getInvitationSenderInfo = await pool.query(
        "SELECT user_name, avatar FROM users WHERE id = $1",
        [invitationSenderId]
      );
      const invitationSenderInfo = getInvitationSenderInfo.rows[0];

      const invitedSenderInfo = {
        user_name: invitationSenderInfo.user_name,
        avatar: invitationSenderInfo.avatar,
      };

      const getInvitations = await pool.query(
        "SELECT * FROM invitations WHERE invitation_sender_id = $1",
        [invitationSenderId]
      );
      const invitations = getInvitations.rows;

      const invitationArray = invitations.map((invitationInfo) => ({
        invitation_id: invitationInfo.id,
        invitation_sender_id: invitationInfo.invitation_sender_id,
        start_time: invitationInfo.start_time,
        end_time: invitationInfo.end_time,
        date: invitationInfo.date,
        sex: invitationInfo.sex,
        age: invitationInfo.age,
        location: invitationInfo.location,
        meal_price: invitationInfo.meal_price_range,
        description: invitationInfo.description,
      }));

      const data = { invitedSenderInfo, invitations: invitationArray };
      responseData.push(data);
    }

    // console.log(responseData);
    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
