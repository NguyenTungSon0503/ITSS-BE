import decodedToken from "../middleware/decode.js";
import pool from "../db.js";
import fixDate from "../utils/date-helpers.js";

const createContract = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    // only user role is allowed
    if (userInfo.role !== "user") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }
    const { recommendation_id } = req.body;
    const newContract = await pool.query(
      "INSERT INTO contracts (recommendation_id) VALUES ($1) RETURNING *",
      [recommendation_id]
    );
    res.send(newContract.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getContractUser = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    // only user role is allowed
    if (userInfo.role !== "user") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }
    const user_id = userInfo.id;
    const getContractsInfo = await pool.query(
      "SELECT c.id,c.recommendation_id,c.invitation_sender_rating,c.recommendation_sender_rating,c.invitation_sender_cmt,c.recommendation_sender_cmt,i.start_time,i.end_time,i.date, r.food_recommend, r.description, r.meal_price, u.name, u.age, u.sex, u.avatar FROM contracts c INNER JOIN recommendations r on c.recommendation_id = r.id INNER JOIN invitations i ON r.invitation_id = i.id INNER JOIN users u ON r.recommendation_sender_id = u.id WHERE i.invitation_sender_id = $1;",
      [user_id]
    );
    let arrayResponse = [];
    getContractsInfo.rows.map((contractInfo) => {
      const updatedDate = fixDate(contractInfo.date);
      const data = {
        ...contractInfo,
        date: updatedDate,
      };
      arrayResponse.push(data);
    });
    res.send(arrayResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getContractPartner = async (req, res) => {
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
    const getContractsInfo = await pool.query(
      "SELECT c.id,c.recommendation_id,c.invitation_sender_rating,c.recommendation_sender_rating,c.invitation_sender_cmt,c.recommendation_sender_cmt,i.start_time,i.end_time,i.date,r.description, r.meal_price, r.food_recommend,u.name, u.age, u.sex, u.avatar FROM contracts c INNER JOIN recommendations r on c.recommendation_id = r.id INNER JOIN invitations i ON r.invitation_id = i.id INNER JOIN users u ON i.invitation_sender_id = u.id WHERE r.recommendation_sender_id = $1;",
      [user_id]
    );
    res.send(getContractsInfo.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const reviewUser = async (req, res) => {
  try {
    const { id, rate, comment } = req.body;
    console.log(id, rate, comment);
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    // only user role is allowed
    if (userInfo.role == "user") {
      const newReview = await pool.query(
        "UPDATE contracts SET recommendation_sender_rating = $1, recommendation_sender_cmt = $2 WHERE id = $3",
        [rate, comment, id]
      );
      res.json(newReview);
    }
    if (userInfo.role == "partner") {
      const newReview = await pool.query(
        "UPDATE contracts SET invitation_sender_rating = $1, invitation_sender_cmt = $2 WHERE id = $3",
        [rate, comment, id]
      );
      res.json(newReview);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export { createContract, getContractUser, getContractPartner, reviewUser };
