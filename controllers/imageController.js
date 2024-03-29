import { cloudinary } from "../utils/cloudinary.js";
import pool from "../db.js";
import jwt from "jsonwebtoken";
import decodedToken from "../middleware/decode.js";

//if wanna domain is /api/images/get then add /get behind
const getUserImage = async (req, res) => {
  // console.log(req.cookies.accessToken);
  try {
    //get access token from cookie from client
    const accessToken = req.cookies.accessToken;
    const userInfo = await decodedToken(accessToken);
    const publicID = userInfo.avatar;
    // console.log(publicID);
    const { resources } = await cloudinary.search
      //folder with preset
      .expression("folder:test")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();
    // console.log(resources);
    // const publicIds = resources.map((file) => file.public_id);
    res.send(publicID);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
};

const createUserImage = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    //decode to get information of user who is logining
    const userInfo = await decodedToken(accessToken);
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      //create new preset in cloudinary console
      upload_preset: "test_preset",
    });
    // update avatar field with publicId has taken from client
    const newAvatar = await pool.query(
      "UPDATE ONLY users SET avatar = $1 WHERE email = $2 RETURNING avatar",
      [uploadResponse.public_id, userInfo.email]
    );
    // console.log(newAvatar.rows);
    res.json({ msg: "uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
};
export { getUserImage, createUserImage };
