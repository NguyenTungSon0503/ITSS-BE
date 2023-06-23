import decodedToken from "../middleware/decode.js";
import pool from "../db.js";
import fixDate from "../utils/date-helpers.js";

const getAllInvitations = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    // only partner role is allowed
    if (userInfo.role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    const getInvitationsInfo = await pool.query("SELECT * FROM invitations");
    //update all of date of invitations with fixDate function
    let invitationsInfo = getInvitationsInfo.rows;
    invitationsInfo = invitationsInfo.map((invitation) => {
      const updatedDate = fixDate(invitation.date);
      return {
        ...invitation,
        date: updatedDate,
      };
    });

    // console.log(invitationsInfo);
    res.send({ invitations: invitationsInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createInvitation = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);

    // only user role is allowed
    if (userInfo.role !== "user") {
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
};

const getInvitationsTest = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);

    // only partner role is allowed
    if (userInfo.role !== "partner") {
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
        "SELECT name, avatar FROM users WHERE id = $1",
        [invitationSenderId]
      );
      const invitationSenderInfo = getInvitationSenderInfo.rows[0];

      const invitedSenderInfo = {
        user_name: invitationSenderInfo.name,
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
};

const getInvitations = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);

    // only partner role is allowed
    if (userInfo.role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    const getInvitationsInfo = await pool.query(
      "SELECT * FROM invitations ORDER BY created_at DESC;"
    );
    let invitations = getInvitationsInfo.rows;
    //update all of date of invitations with fixDate function
    invitations = invitations.map((invitation) => {
      const updatedDate = fixDate(invitation.date);
      return {
        ...invitation,
        date: updatedDate,
      };
    });
    //get userInfo for each invitation
    const responseData = [];
    for (const invitation of invitations) {
      const invitationSenderId = invitation.invitation_sender_id;
      try {
        //query userInfo with foreign key invitationSenderId
        const getInvitationSenderInfo = await pool.query(
          "SELECT * FROM users WHERE id = $1",
          [invitationSenderId]
        );
        const invitationSenderInfo = getInvitationSenderInfo.rows[0];
        // object userInfo
        const invitedSenderInfo = {
          user_name: invitationSenderInfo.name,
          avatar: invitationSenderInfo.avatar,
        };
        // object with userInfo and invitationInfor
        const data = {
          userInfo: invitedSenderInfo,
          invitationInfor: invitation,
        };
        responseData.push(data);
      } catch (err) {
        res.json({ message: err.message });
      }
    }
    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createRejectedInvitation = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const userInfo = await decodedToken(accessToken);

  // only partner role is allowed
  if (userInfo.role !== "partner") {
    return res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }

  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    const partner_id = userInfo.id;
    const { invitation_id } = req.body;
    const newRejectedInvitation = await pool.query(
      "INSERT INTO invitation_rejections (invitation_id, partner_id) VALUES ($1, $2) RETURNING *",
      [invitation_id, partner_id]
    );
    res.send(newRejectedInvitation.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getInvitationsNew = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    const userID = userInfo.id;
    // only partner role is allowed
    if (userInfo.role !== "partner") {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    const getInvitationsIDs = await pool.query(
      "SELECT id FROM invitations ORDER BY created_at DESC;"
    );
    const getRejectedInvitationsIDs = await pool.query(
      "SELECT invitation_id FROM invitation_rejections WHERE partner_id = $1",
      [userID]
    );
    const getAcceptedInvitationsIDs = await pool.query(
      "SELECT invitation_id FROM recommendations WHERE recommendation_sender_id = $1",
      [userID]
    );
    const arrayInvitationsIDs = [];
    const arrayRejectedInvitationsIDs = [];
    const arrayAcceptedInvitationsIDs = [];
    getInvitationsIDs.rows.map((invitationID) => {
      arrayInvitationsIDs.push(invitationID.id);
    });
    getRejectedInvitationsIDs.rows.map((invitationID) => {
      arrayRejectedInvitationsIDs.push(invitationID.invitation_id);
    });
    getAcceptedInvitationsIDs.rows.map((invitationID) => {
      arrayAcceptedInvitationsIDs.push(invitationID.invitation_id);
    });
    // console.log(arrayAcceptedInvitationsIDs)
    
    const abc =  arrayAcceptedInvitationsIDs.concat(arrayRejectedInvitationsIDs)

    const arrayShowInvitationsIDs = arrayInvitationsIDs.filter(
      (element) => !abc.includes(element)
    );
    console.log(arrayShowInvitationsIDs)
    const responseData = [];
    for (let id of arrayShowInvitationsIDs) {
      try {
        const getInvitationInfo = await pool.query(
          "SELECT * FROM invitations WHERE id = $1",
          [id]
        );
        const invitationsInfo = getInvitationInfo.rows;
        const promises = invitationsInfo.map(async (invitation) => {
          const invitationSenderId = invitation.invitation_sender_id;
          const getInvitationSenderInfo = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [invitationSenderId]
          );
          const invitationSenderInfo = getInvitationSenderInfo.rows[0];
          const updatedDate = fixDate(invitation.date);
          const invitationJSON = {
            ...invitation,
            date: updatedDate,
          };
          const invitedSenderInfo = {
            user_name: invitationSenderInfo.name,
            avatar: invitationSenderInfo.avatar,
          };
          const data = {
            userInfo: invitedSenderInfo,
            invitationInfor: invitationJSON,
          };
          return data;
        });
        const resolvedData = await Promise.all(promises);
        responseData.push(...resolvedData);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    // console.log(responseData.length);
    res.send(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getInvitationsNew,
  createRejectedInvitation,
  getAllInvitations,
  createInvitation,
  getInvitationsTest,
  getInvitations,
};
