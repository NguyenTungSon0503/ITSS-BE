import decodedToken from "../middleware/decode.js";
import pool from "../db.js";
import fixDate from "../utils/date-helpers.js";

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
    const responseData = [];
    const getReview = await pool.query(
      "SELECT c.recommendation_sender_rating, c.recommendation_sender_cmt, u.name, c.updated_at FROM contracts c INNER JOIN recommendations r ON c.recommendation_id = r.id INNER JOIN invitations i ON r.invitation_id = i.id INNER JOIN users u ON i.invitation_sender_id = u.id  WHERE r.recommendation_sender_id = $1",
      [partner_id]
    );
    const getCount = await pool.query("SELECT COUNT(*) AS total_records FROM contracts c INNER JOIN recommendations r on c.recommendation_id=r.id INNER JOIN invitations i on r.invitation_id = i.id INNER JOIN users u ON r.recommendation_sender_id = u.id where u.id = $1;",[partner_id])
    
    const getSum = await pool.query("SELECT SUM(c.recommendation_sender_rating) AS total_rating FROM contracts c INNER JOIN recommendations r on c.recommendation_id=r.id INNER JOIN invitations i on r.invitation_id = i.id INNER JOIN users u ON r.recommendation_sender_id = u.id where u.id = $1;", [partner_id])


    const rating = parseInt(getSum.rows[0]?.total_rating)/parseInt(getCount.rows[0]?.total_records)

    getReview.rows.map((item) => {
      const updatedDate = fixDate(item.updated_at);
      const data = {
        ...item,
        rating: rating,
        updated_at: updatedDate
      }
      responseData.push(data);
    })
    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export { getReviewUser, getReviewPartner };
