import decodedToken from "../middleware/decode.js";
import pool from "../db.js";
import fixDate from "../utils/date-helpers.js";

const createRecommendation = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    // only partner role is allowed
    if (userInfo.role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }
    const { invitation_id, food_recommend, meal_price, description } = req.body;
    const newRecommendation = await pool.query(
      "INSERT INTO recommendations (invitation_id, recommendation_sender_id, food_recommend, meal_price, description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [invitation_id, userInfo.id, food_recommend, meal_price, description]
    );

    res.send(newRecommendation.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    if (userInfo.role !== "user") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }
    const userId = userInfo.id;
    const getInvitationsInfo = await pool.query(
      "SELECT * FROM invitations WHERE invitation_sender_id = $1",
      [userId]
    );
    const invitations = getInvitationsInfo.rows;
    const responseData = await Promise.all(
      invitations.map(async (invitation) => {
        const getRecommendationsInfo = await pool.query(
          "SELECT * FROM recommendations WHERE invitation_id = $1 ORDER BY created_at DESC;",
          [invitation.id]
        );
        const updatedDate = fixDate(invitation.date);
        const invitationJSON = {
          ...invitation,
          date: updatedDate,
        };
        const recommendationsInfo = getRecommendationsInfo.rows;
        const promises = recommendationsInfo.map(async (recommendation) => {
          const getUserInfo = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [recommendation.recommendation_sender_id]
          );
          const userInfo = {
            user_name: getUserInfo.rows[0].name,
            avatar: getUserInfo.rows[0].avatar,
            age: getUserInfo.rows[0].age,
            sex: getUserInfo.rows[0].sex,
            location: getUserInfo.rows[0].location,
          };
          const data = {
            userInfo: userInfo,
            recommendationInfo: recommendation,
          };
          return data;
        });
        const resolvedData = await Promise.all(promises);
        return {
          invitationInfo: invitationJSON,
          recommendations: resolvedData,
        };
      })
    );
    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createRejectedRecommendation = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const userInfo = await decodedToken(accessToken);

  // only partner role is allowed
  if (userInfo.role !== "user") {
    return res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }

  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    const user_id = userInfo.id;
    const { recommendation_id } = req.body;
    const newRejectedRecommendation = await pool.query(
      "INSERT INTO recommendation_rejections (recommendation_id, user_id) VALUES ($1, $2) RETURNING *",
      [recommendation_id, user_id]
    );
    res.send(newRejectedRecommendation.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getRecommendationsNew = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    if (userInfo.role !== "user") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }
    const userId = userInfo.id;
    const getInvitationsInfo = await pool.query(
      "SELECT * FROM invitations WHERE invitation_sender_id = $1",
      [userId]
    );
    const invitations = getInvitationsInfo.rows;
    const getRejectRecommendations = await pool.query(
      "SELECT recommendation_id FROM recommendation_rejections where user_id = $1",
      [userId]
    );
    const arrayRecommendationsID = [];
    const arrayRejectRecommendationsID = [];
    getRejectRecommendations.rows.map((recommendation) => {
      arrayRejectRecommendationsID.push(recommendation.recommendation_id);
    });
    console.log(arrayRejectRecommendationsID);

    let arrayShowRecommendationsIDs;

    const responseData = await Promise.all(
      invitations.map(async (invitation) => {
        const getRecommendationsInfo = await pool.query(
          "SELECT * FROM recommendations WHERE invitation_id = $1 ORDER BY created_at DESC;",
          [invitation.id]
        );
        getRecommendationsInfo.rows.map((test) => {
          arrayRecommendationsID.push(test.id);
        });
        arrayShowRecommendationsIDs = arrayRecommendationsID.filter(
          (element) => !arrayRejectRecommendationsID.includes(element)
        );
        console.log(arrayShowRecommendationsIDs);
        const updatedDate = fixDate(invitation.date);
        const invitationJSON = {
          ...invitation,
          date: updatedDate,
        };

        const promises = arrayShowRecommendationsIDs.map(async (id) => {
          const recommendationInfo = await pool.query(
            "SELECT * FROM recommendations WHERE id = $1",
            [id]
          );
          const recommendation = recommendationInfo.rows[0];
          const recommendation_sender_id =
            recommendationInfo.rows[0].recommendation_sender_id;
          const getUserInfo = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [recommendation_sender_id]
          );
          const userInfo = {
            user_name: getUserInfo.rows[0].name,
            avatar: getUserInfo.rows[0].avatar,
            age: getUserInfo.rows[0].age,
            sex: getUserInfo.rows[0].sex,
            location: getUserInfo.rows[0].location,
          };
          const data = {
            userInfo: userInfo,
            recommendationInfo: recommendation,
          };
          return data;
        });

        const resolvedData = await Promise.all(promises);
        return {
          invitationInfo: invitationJSON,
          recommendations: resolvedData,
        };
      })
    );
    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createRecommendation,
  getRecommendations,
  createRejectedRecommendation,
  getRecommendationsNew,
};
