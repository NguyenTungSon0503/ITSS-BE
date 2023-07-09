import decodedToken from "../middleware/decode.js";
import pool from "../db.js";

const getReviewUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    // only user role is allowed
    if (userInfo.role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }
    const user_id = userInfo.id;

    const getReview = await pool.query(
      "SELECT c.invitation_sender_rating, c.invitation_sender_cmt, u.name FROM contracts c INNER JOIN recommendations r ON c.recommendation_id = r.id INNER JOIN users u ON r.recommendation_sender_id = u.id INNER JOIN invitations i ON r.invitation_id = i.id WHERE i.invitation_sender_id = $1",
      [user_id]
    );
    res.json(getReview.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getReviewPartner = async (req, res, next) => {
  const { partner_id } = req.body;
  console.log(partner_id);
  try {
    const getReview = await pool.query(
      "SELECT c.recommendation_sender_rating, c.recommendation_sender_cmt, u.name FROM contracts c INNER JOIN recommendations r ON c.recommendation_id = r.id INNER JOIN invitations i ON r.invitation_id = i.id INNER JOIN users u ON i.invitation_sender_id = u.id  WHERE r.recommendation_sender_id = $1",
      [partner_id]
    );
    res.json(getReview.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export { getReviewUser, getReviewPartner };
